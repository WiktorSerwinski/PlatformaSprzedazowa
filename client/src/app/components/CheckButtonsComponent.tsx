import { FormGroup, FormControlLabel, Checkbox } from "@mui/material";
import { useState } from "react";
interface Props{
    items: string[],
    checked?: string[],
    onChange: (items: string[]) => void;
    sx?: {};
    cond?: boolean;
}



export default function CheckButtonsComponent({checked,items,onChange,sx,cond}:Props){
    const[checkedItems,setCheckedItems] = useState(checked || [])

    function handleChecked(value: string) {
        const currentIndex = checkedItems.findIndex(item => item ===value);
        let newChecked: string[] = [];
        if(currentIndex===-1) newChecked = [...checkedItems,value];
        else newChecked = checkedItems.filter(item => item!==value);
        setCheckedItems(newChecked);
        onChange(newChecked)
    }
    
    
    return(
        <FormGroup sx={sx}>
        {items.map(item=>(
            <FormControlLabel 
            control={<Checkbox 
                checked={checkedItems.indexOf(item)!== -1}
                onClick={()=>handleChecked(item)}
                disabled={cond}
            />} 
            label={item} key={item} />
        ))}
      </FormGroup>
    )
}