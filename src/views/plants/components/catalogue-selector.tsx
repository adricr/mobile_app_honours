import {
    Select,
    SelectContent,
    SelectDragIndicator,
    SelectDragIndicatorWrapper,
    SelectInput,
    SelectItem,
    SelectPortal,
    SelectScrollView,
    SelectTrigger
} from '@/components/ui/select';
import { CatalogueEntry } from "@/src/data/repositories/plant-knowledge";
import Ionicons from '@react-native-vector-icons/ionicons/static';
import { View } from "react-native";
type SelectorInput = {
    setPlantSpeciesName: (species: string | null) => void,
    plantSpeciesName: string | null,
    catalogue: CatalogueEntry[] | null
}
export default function CatalogueSelector({setPlantSpeciesName, plantSpeciesName, catalogue}:SelectorInput){
    let catalogueSelectItems = catalogue?.map(plant => {
        
        return(
            <SelectItem 
            key={plant.species}
            label={plant.species}
            value={plant.species}
            />
        );
    })
    return(
        <View>
            <Select 
                selectedValue={plantSpeciesName}
                initialLabel={plantSpeciesName === "Other" ? "Can't find my species" : plantSpeciesName ?? undefined}
                onValueChange={setPlantSpeciesName}
            >
            <SelectTrigger className='justify-between px-3' variant="outline" size="md">
                <SelectInput placeholder="Select option" />
                <Ionicons color={"white"} name={'chevron-down-outline'}></Ionicons>
            </SelectTrigger>
            <SelectPortal>
                <SelectContent className="max-h-1/3">
                <SelectDragIndicatorWrapper>
                    <SelectDragIndicator />
                </SelectDragIndicatorWrapper>
                <SelectScrollView>
                    {catalogueSelectItems}
                    <SelectItem label="Can't find my species" value='Other'/>
                </SelectScrollView>
                
                </SelectContent>
            </SelectPortal>
            </Select>

        </View>
    );
}