import { create } from 'zustand'
import axios from 'axios'
import { Company, QuestionCategory } from '@/types'

interface CompanyStore {
  // State
  company: Company | null
  categories: QuestionCategory[]
  loading: boolean
  error: string | null
  
  // Actions
  fetchCompanyData: (companyName: string) => Promise<void>
  setCompany: (company: Company) => void
  setCategories: (categories: QuestionCategory[]) => void
  reset: () => void
}

export const useCompanyStore = create<CompanyStore>((set, get) => ({
  // Initial state
  company: null,
  categories: [],
  loading: false,
  error: null,

  // Actions
  fetchCompanyData: async (companyName: string) => {
    const { company } = get()
    
    // Don't fetch if we already have data for this company
    if (company && company.name === companyName) return

    set({ loading: true, error: null })

    try {
      // Fetch company data
      const companyResponse = await axios.get(
        `/api/companies/names/${encodeURIComponent(companyName)}`
      )
      const companyData = companyResponse.data.company
      
      // Fetch categories for this company
      const categoriesResponse = await axios.get(
        `/api/question-categories?formId=${companyData.formId}&limit=100&sortBy=order&sortOrder=asc`
      )
      const categoriesData = categoriesResponse.data.data.questionCategories || []

      set({ 
        company: companyData, 
        categories: categoriesData, 
        loading: false 
      })
    } catch (error) {
      console.error('Error fetching company data:', error)
      set({ 
        error: 'Failed to load company data', 
        loading: false 
      })
    }
  },

  setCompany: (company: Company) => set({ company }),
  
  setCategories: (categories: QuestionCategory[]) => set({ categories }),

  reset: () => set({ 
    company: null, 
    categories: [], 
    loading: false, 
    error: null 
  })
}))