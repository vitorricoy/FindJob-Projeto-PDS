import { List, ListItem } from "@material-ui/core";
import React from "react";
import { 
    Container,
    OuterContainer,
    StyledTitle,
    StyledRegisterButton,
    StyledButtonContainer,
    StyledRegisterInfoContainer,
    InputContainer,
    StyledInput,
    RowContainer,
    FreelancerContainer,
    StyledAddAbilityButton,
    StyledSlider,
    StyledListItemText,
    StyledCheckbox,
    StyledFormControlLabel
} from "./styles";

export function Register () {
    const [checked, setChecked] = React.useState(false);
    const [value, setValue] = React.useState<number>(30);
    const [newAbilityInput, setNewAbilityInput] = React.useState<boolean>(false);
    const [abilities, setAbilities] = React.useState<any[]>(["Java", "Python", "Habilidade Secreta Interessante", "Programação WEB"]);

    const handleCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked(event.target.checked);
        setNewAbilityInput(false);
    };

    let abilitiesScore: any;

    const handleSliderChange = (event: Event, newValue: number | number[]) => {
        setValue(newValue as number);
        abilitiesScore.habilidade = newValue;
    };

    const handleAddNewAbilityInput = () => {
        setNewAbilityInput(!newAbilityInput);
    };

    const [name, setName] = React.useState('');
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    };
    
    const handleAddNewAbility = (ability: string) => {
        if (ability.trim().length > 0) {
            let newAbilities = abilities;
            newAbilities.push(ability);
            setAbilities(newAbilities);
        }
        setName("");
        setNewAbilityInput(false);
    };

    return (
        <div>

            <Container>
                <OuterContainer>
                    <StyledTitle>
                        Cadastro
                    </StyledTitle>

                    <StyledRegisterInfoContainer>
                        <RowContainer>
                            <InputContainer> <StyledInput variant="outlined" label="E-mail" InputLabelProps={{ shrink: true, required: true }}/> </InputContainer>
                            
                            <InputContainer> <StyledInput variant="outlined" label="Senha" type="password" InputLabelProps={{ shrink: true, required: true }}/> </InputContainer>
                        </RowContainer>

                        <RowContainer>
                            <InputContainer> <StyledInput variant="outlined" label="Nome Completo" InputLabelProps={{ shrink: true, required: true }}/> </InputContainer>

                            <InputContainer> <StyledInput variant="outlined" label="Telefone" InputLabelProps={{ shrink: true, required: true }}/> </InputContainer>
                        </RowContainer>

                        <div style={{height: "8%"}}>
                            <StyledFormControlLabel control={
                                <StyledCheckbox
                                    checked={checked}
                                    onChange={handleCheck}
                                    inputProps={{ 'aria-label': 'controlled' }}
                                    color="primary"
                                />
                            } label="Sou um freelancer"/>
                        </div>

                        <FreelancerContainer>
                            {checked? 
                                <div>
                                    <p style={{ fontFamily: "'Roboto Condensed', sans-serif",
                                                fontStyle: "normal",
                                                fontWeight: "600",
                                                fontSize: "16px",
                                                lineHeight: "16px",
                                                marginBlock: "0",
                                                color: "#4A5568"}}>
                                        Habilidades 
                                    </p>

                                    <List>
                                        {abilities.map(ability => {
                                            return(
                                                <ListItem style={{justifyContent: "space-between", display: "flex", width: "60%"}} key={ability}>
                                                    <div style={{width: "40%", marginRight: "8px", overflow: "hidden", textOverflow: "ellipsis"}}>
                                                        <StyledListItemText primary={ability} style={{color: "#2D3748"}}/>
                                                    </div>
                                                    <div style={{width: "60%", marginLeft: "4px"}}>
                                                        <StyledSlider
                                                            aria-label="Temperature"
                                                            defaultValue={0}
                                                            valueLabelDisplay="auto"
                                                            step={10}
                                                            marks
                                                            min={0}
                                                            max={100}
                                                            onChange={() => handleSliderChange}
                                                        />
                                                    </div>
                                                </ListItem>
                                            ) 
                                        })}
                                    </List>

                                    <div style={{display: "flex", alignItems: "center"}}>
                                        {newAbilityInput && 
                                            <div style={{padding: "0 16px"}}>
                                                <StyledInput 
                                                    variant="standard"
                                                    label="Nova habilidade"
                                                    value={name}
                                                    onChange={handleChange}
                                                    onKeyPress={(ev) => {
                                                        if (ev.key === 'Enter') {
                                                            handleAddNewAbility(name)
                                                        }
                                                    }}/>
                                            </div>}

                                        {!newAbilityInput && <StyledAddAbilityButton onClick={handleAddNewAbilityInput}>+</StyledAddAbilityButton>}
                                    </div>
                                </div>
                            : null}
                        </FreelancerContainer>
                    </StyledRegisterInfoContainer>

                    <StyledButtonContainer>
                        <StyledRegisterButton> Cadastrar </StyledRegisterButton>
                    </StyledButtonContainer>
                    
                </OuterContainer>
            </Container>


        </div>
    );
}