import { create } from "zustand"
import {createJSONStorage, persist} from "zustand/middleware"

export const useUserStore = create()(persist((set) => ({
    session: undefined,
    clearSession: function(){set({session: undefined})
    },
    setSession: (session) => set({session})
    }),
    {
    name: 'user-store',
    storage: createJSONStorage(() => localStorage),

    },
),
)