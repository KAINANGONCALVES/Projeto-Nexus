import { useState, useEffect, useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FirebaseService } from '@/lib/firebase-service';
import { User, UserProfile, FirebaseConversion } from '@/lib/types';
import { toast } from '@/hooks/use-toast';
import { auth } from '@/lib/firebase';

// Configurações padrão para queries
const DEFAULT_STALE_TIME = 5 * 60 * 1000; // 5 minutos
const DEFAULT_GC_TIME = 10 * 60 * 1000; // 10 minutos

// Hook para autenticação
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Setting up auth state listener...');
    
    const unsubscribe = FirebaseService.onAuthStateChange(async (firebaseUser) => {
      console.log('Auth state changed:', firebaseUser);
      
      if (firebaseUser) {
        // Buscar perfil completo do Firestore para ter o displayName correto
        try {
          const profile = await FirebaseService.getUserProfile(firebaseUser.uid);
          
          const user: User = {
            uid: firebaseUser.uid,
            email: firebaseUser.email!,
            displayName: profile?.displayName || firebaseUser.displayName || undefined,
            photoURL: firebaseUser.photoURL || undefined,
            createdAt: new Date()
          };
          setUser(user);
        } catch (error) {
          console.error('Error fetching user profile:', error);
          // Fallback para dados do Firebase Auth
          const user: User = {
            uid: firebaseUser.uid,
            email: firebaseUser.email!,
            displayName: firebaseUser.displayName || undefined,
            photoURL: firebaseUser.photoURL || undefined,
            createdAt: new Date()
          };
          setUser(user);
        }
      } else {
        setUser(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, loading };
};

// Hook para login
export const useLogin = () => {
  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      return FirebaseService.loginUser(email, password);
    },
    onSuccess: () => {
      toast({
        title: "Login realizado",
        description: "Bem-vindo de volta!",
      });
    },
    onError: (error: any) => {
      let message = "Erro no login. Tente novamente.";
      
      if (error.code === 'auth/user-not-found') {
        message = "Usuário não encontrado.";
      } else if (error.code === 'auth/wrong-password') {
        message = "Senha incorreta.";
      } else if (error.code === 'auth/invalid-email') {
        message = "Email inválido.";
      } else if (error.code === 'auth/too-many-requests') {
        message = "Muitas tentativas. Tente novamente mais tarde.";
      }
      
      toast({
        title: "Erro no login",
        description: message,
        variant: "destructive",
      });
    }
  });
};

// Hook para registro
export const useRegister = () => {
  return useMutation({
    mutationFn: async ({ 
      email, 
      password, 
      displayName 
    }: { 
      email: string; 
      password: string; 
      displayName: string; 
    }) => {
      return FirebaseService.registerUser(email, password, displayName);
    },
    onSuccess: () => {
      toast({
        title: "Conta criada",
        description: "Bem-vindo ao TuctorCripto!",
      });
    },
    onError: (error: any) => {
      let message = "Erro no cadastro. Tente novamente.";
      
      if (error.code === 'auth/email-already-in-use') {
        message = "Este email já está em uso.";
      } else if (error.code === 'auth/weak-password') {
        message = "A senha deve ter pelo menos 6 caracteres.";
      } else if (error.code === 'auth/invalid-email') {
        message = "Email inválido.";
      }
      
      toast({
        title: "Erro no cadastro",
        description: message,
        variant: "destructive",
      });
    }
  });
};

// Hook para logout
export const useLogout = () => {
  return useMutation({
    mutationFn: async () => {
      return FirebaseService.logoutUser();
    },
    onSuccess: () => {
      toast({
        title: "Logout realizado",
        description: "Até logo!",
      });
    },
    onError: () => {
      toast({
        title: "Erro no logout",
        description: "Tente novamente",
        variant: "destructive",
      });
    }
  });
};

// Hook para perfil do usuário
export const useUserProfile = (uid: string) => {
  return useQuery({
    queryKey: ['userProfile', uid],
    queryFn: () => FirebaseService.getUserProfile(uid),
    enabled: !!uid,
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
  });
};

// Hook para favoritos
export const useFavorites = (uid: string) => {
  const queryClient = useQueryClient();
  const { data: profile } = useUserProfile(uid);

  const updateFavorites = useMutation({
    mutationFn: async (favorites: string[]) => {
      return FirebaseService.updateUserFavorites(uid, favorites);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile', uid] });
    },
    onError: () => {
      toast({
        title: "Erro ao atualizar favoritos",
        description: "Tente novamente",
        variant: "destructive",
      });
    }
  });

  const addFavorite = useCallback((symbol: string) => {
    if (!profile) return;
    
    const newFavorites = profile.favorites.includes(symbol) 
      ? profile.favorites 
      : [...profile.favorites, symbol];
    
    updateFavorites.mutate(newFavorites);
    
    toast({
      title: "Adicionado aos favoritos",
      description: `${symbol} foi adicionado aos seus favoritos.`,
    });
  }, [profile, updateFavorites]);

  const removeFavorite = useCallback((symbol: string) => {
    if (!profile) return;
    
    const newFavorites = profile.favorites.filter(fav => fav !== symbol);
    updateFavorites.mutate(newFavorites);
    
    toast({
      title: "Removido dos favoritos",
      description: `${symbol} foi removido dos seus favoritos.`,
    });
  }, [profile, updateFavorites]);

  const toggleFavorite = useCallback((symbol: string) => {
    if (!profile) return;
    
    if (profile.favorites.includes(symbol)) {
      removeFavorite(symbol);
    } else {
      addFavorite(symbol);
    }
  }, [profile, addFavorite, removeFavorite]);

  return {
    favorites: profile?.favorites || [],
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isLoading: updateFavorites.isPending
  };
};

// Hook para conversões
export const useConversions = (userId: string) => {
  const queryClient = useQueryClient();

  const { data: conversions = [], isLoading } = useQuery({
    queryKey: ['conversions', userId],
    queryFn: () => FirebaseService.getUserConversions(userId),
    enabled: !!userId,
    staleTime: 1 * 60 * 1000, // 1 minuto
    gcTime: 5 * 60 * 1000, // 5 minutos
  });

  const saveConversion = useMutation({
    mutationFn: async (conversion: Omit<FirebaseConversion, 'id'>) => {
      return FirebaseService.saveConversion(conversion);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversions', userId] });
    },
    onError: () => {
      toast({
        title: "Erro ao salvar conversão",
        description: "Tente novamente",
        variant: "destructive",
      });
    }
  });

  const deleteConversion = useMutation({
    mutationFn: async (conversionId: string) => {
      return FirebaseService.deleteConversion(conversionId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversions', userId] });
      toast({
        title: "Conversão removida",
        description: "Conversão removida com sucesso",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao remover conversão",
        description: "Tente novamente",
        variant: "destructive",
      });
    }
  });

  const clearConversions = useMutation({
    mutationFn: async () => {
      return FirebaseService.clearUserConversions(userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversions', userId] });
      toast({
        title: "Histórico limpo",
        description: "Todas as conversões foram removidas",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao limpar histórico",
        description: "Tente novamente",
        variant: "destructive",
      });
    }
  });

  return {
    conversions,
    isLoading,
    saveConversion,
    deleteConversion,
    clearConversions
  };
}; 