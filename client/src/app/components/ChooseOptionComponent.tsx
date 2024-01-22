import { FormControl, RadioGroup, FormControlLabel, Radio } from "@mui/material";

interface Props {
    sortOptions: any[];
    onChange: (event: any) => void;
    selectedValue: string;
}



export default function ChooseOptionComponent({onChange,sortOptions,selectedValue}:Props){
    return(
        <FormControl component={'fieldset'}>
            <RadioGroup onChange={onChange} value={selectedValue}>
            {sortOptions.map(({value,label})=>(
                <FormControlLabel value={value} control={<Radio />} label={label} key={value}/>    
            ))}
            </RadioGroup>
        </FormControl>
    )
}