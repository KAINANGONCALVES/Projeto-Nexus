import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FirebaseService } from '@/lib/firebase-service';
import { User, UserProfile, FirebaseConversion } from '@/lib/types';
import { toast } from '@/hooks/use-toast';
import { auth } from '@/lib/firebase';

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

// Hook para registro
export const useRegister = () => {
  const queryClient = useQueryClient();

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
    onSuccess: (user) => {
      toast({
        title: "Conta criada com sucesso!",
        description: `Bem-vindo ao TuctorCripto, ${user.displayName}!`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro no cadastro",
        description: error.message,
        variant: "destructive",
      });
    }
  });
};

// Hook para login
export const useLogin = () => {
  return useMutation({
    mutationFn: async ({ 
      email, 
      password 
    }: { 
      email: string; 
      password: string; 
    }) => {
      return FirebaseService.loginUser(email, password);
    },
    onSuccess: (user) => {
      console.log('Login successful:', user);
      toast({
        title: "Login realizado!",
        description: `Bem-vindo de volta, ${user.displayName || user.email}!`,
      });
    },
    onError: (error: Error) => {
      console.error('Login error:', error);
      toast({
        title: "Erro no login",
        description: error.message,
        variant: "destructive",
      });
    }
  });
};

// Hook para logout
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: FirebaseService.logoutUser,
    onSuccess: () => {
      queryClient.clear(); // Limpar cache
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
    staleTime: 5 * 60 * 1000, // 5 minutos
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
    onError: (error) => {
      toast({
        title: "Erro ao atualizar favoritos",
        description: "Tente novamente",
        variant: "destructive",
      });
    }
  });

  const addFavorite = (symbol: string) => {
    if (!profile) return;
    
    const newFavorites = profile.favorites.includes(symbol) 
      ? profile.favorites 
      : [...profile.favorites, symbol];
    
    updateFavorites.mutate(newFavorites);
    
    toast({
      title: "Adicionado aos favoritos",
      description: `${symbol} foi adicionado aos seus favoritos.`,
    });
  };

  const removeFavorite = (symbol: string) => {
    if (!profile) return;
    
    const newFavorites = profile.favorites.filter(fav => fav !== symbol);
    updateFavorites.mutate(newFavorites);
    
    toast({
      title: "Removido dos favoritos",
      description: `${symbol} foi removido dos seus favoritos.`,
    });
  };

  const toggleFavorite = (symbol: string) => {
    if (!profile) return;
    
    if (profile.favorites.includes(symbol)) {
      removeFavorite(symbol);
    } else {
      addFavorite(symbol);
    }
  };

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
  });

  const saveConversion = useMutation({
    mutationFn: async (conversion: Omit<FirebaseConversion, 'id'>) => {
      return FirebaseService.saveConversion(conversion);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversions', userId] });
    },
    onError: (error) => {
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
    onError: (error) => {
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
    onError: (error) => {
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