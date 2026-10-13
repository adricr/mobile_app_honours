import { createContext, ReactNode, useContext, useState } from "react"
import { NewPlantInfo } from "./management"

type PlantDraftContextType = {
    draft: NewPlantInfo | null
    setDraft: (draft: NewPlantInfo | null) => void
    formPage: number
    setFormPage: (page: number) => void
    photoUri: string | null
    setPhotoUri: (uri: string | null) => void
    identifiedSpecies: string | null
    setIdentifiedSpecies: (species: string | null) => void
    clear: () => void
}

const PlantDraftContext = createContext<PlantDraftContextType | null>(null)

export function PlantDraftProvider({ children }: { children: ReactNode }) {
    const [draft, setDraft] = useState<NewPlantInfo | null>(null)
    const [formPage, setFormPage] = useState(0)
    const [photoUri, setPhotoUri] = useState<string | null>(null)
    const [identifiedSpecies, setIdentifiedSpecies] = useState<string | null>(null)

    function clear() {
        setDraft(null)
        setFormPage(0)
        setPhotoUri(null)
        setIdentifiedSpecies(null)
    }

    return (
        <PlantDraftContext.Provider value={{
            draft, setDraft,
            formPage, setFormPage,
            photoUri, setPhotoUri,
            identifiedSpecies, setIdentifiedSpecies,
            clear,
        }}>
            {children}
        </PlantDraftContext.Provider>
    )
}

export function usePlantDraft() {
    const context = useContext(PlantDraftContext)
    if (!context) {
        throw new Error("usePlantDraft must be used inside PlantDraftProvider")
    }
    return context
}