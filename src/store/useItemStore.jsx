import { create } from "zustand"
import { api } from "../api/api"

export const useItemStore = create((set) => ({
    item: null,
    stats: null,
    items: [],
   
    getItems: async () => {
        try {
            const data = await api.getItems()  
            set({ items: data })
        } catch (error) {
            console.error(error)
        }
    },

    getStats: async () => {
        try {
            const data = await api.getStats()
            set({ stats: data })
        } catch (error) {
            console.error(error)
        }
    },

    getItem: async (id) => {
        try {
            const data = await api.getItemDetails(id)  
            set({ item: data })
        } catch (error) {
            console.error(error)
        }
    },
}))