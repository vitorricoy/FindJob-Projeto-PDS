import { Header } from "../Header/Header";
import { Footer } from "../Footer/Footer";
import {
    Body,
    Container,
    CurrencyTextField,
    Filters1,
    Filters2,
    Filters3,
    Filters4,
    Filters5,
    Filters6,
    Filters7,
    FindJobsBottom,
    FindJobsUp,
    GrayPaper,
    JobsList1,
    JobsList2,
    ListItemDiv,
    RightDiv,
    SearchJobTextField,
    SkillField,
    Skills1,
    Skills2,
    Skills3,
    SkillsDiv,
    StyledAddSkillButton,
    StyledList,
} from "./styles";
import { LeftDiv } from "../CreateJob/styles";
import { Checkbox, Divider, FormControlLabel, IconButton, InputAdornment, List, ListItem, ListItemText, MenuItem, TextField, Typography } from "@material-ui/core";
import React, { useEffect } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import { ListItemButton } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useGlobalState } from "../..";
import Job from "../../models/Job";
import axios, { AxiosResponse } from "axios";
import { Constants } from "../../util/Constants";
import Skill from "../../models/Skill";

const currencies = [
    {
        value: 'R$',
        label: 'Real (BRL)',
    },
    {
        value: 'US$',
        label: 'Dólar (USD)',
    },
    {
        value: '€',
        label: 'Euro (EUR)',
    },
    {
        value: '¥',
        label: 'Iene (JPY)',
    },
];

export function JobsList() {
    const [currency, setCurrency] = React.useState('R$');

    const [currentUser] = useGlobalState('currentUser');

    const handleCurrencyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCurrency(event.target.value);
    };

    const [perHourChecked, setPerHourChecked] = React.useState<boolean>(false);
    const [perHourPaymentMin, setPerHourPaymentMin] = React.useState();
    const [perHourPaymentMax, setPerHourPaymentMax] = React.useState();

    const [totalChecked, setTotalChecked] = React.useState<boolean>(false);
    const [totalPaymentMin, setTotalPaymentMin] = React.useState();
    const [totalPaymentMax, setTotalPaymentMax] = React.useState();

    const [perHourTextFieldDisable, setPerHourTextFieldDisable] = React.useState<boolean>(true);
    const [totalTextFieldDisable, setTotalTextFieldDisable] = React.useState<boolean>(true);

    const [deadlineMin, setDeadlineMin] = React.useState();
    const [deadlineMax, setDeadlineMax] = React.useState();

    const [searchQuery, setSearchQuery] = React.useState("");

    const handlePaymentMethodChange = (event: any) => {
        if ((event === 'total')) {
            setTotalChecked(!totalChecked);
            setTotalTextFieldDisable(!totalTextFieldDisable);
            setPerHourChecked(false);
            setPerHourTextFieldDisable(true);
        } else if (event === 'hour') {
            setTotalChecked(false);
            setTotalTextFieldDisable(true);
            setPerHourChecked(!perHourChecked);
            setPerHourTextFieldDisable(!perHourTextFieldDisable);
        }
    };

    const handleTotalPaymentMinChange = (event: any) => {
        setTotalPaymentMin(event.target.value);
    }

    const handleTotalPaymentMaxChange = (event: any) => {
        setTotalPaymentMax(event.target.value);
    }

    const handlePerHourPaymentMinChange = (event: any) => {
        setPerHourPaymentMin(event.target.value);
    }

    const handlePerHourPaymentMaxChange = (event: any) => {
        setPerHourPaymentMax(event.target.value);
    }

    function checkPaymentInterval(price: number) {
        if (totalChecked) {
            if (price >= (totalPaymentMin ? totalPaymentMin : 0) && price <= (totalPaymentMax ? totalPaymentMax : Number.POSITIVE_INFINITY)) { return true }
            else { return false }
        } else if (perHourChecked) {
            if (price >= (perHourPaymentMin ? perHourPaymentMin : 0) && price <= (perHourPaymentMax ? perHourPaymentMax : Number.POSITIVE_INFINITY)) { return true }
            else { return false }
        } else {
            return true;
        }
    }

    function checkPaymentType(isPaymentByHour: boolean) {
        if (isPaymentByHour && totalChecked) {
            return false;
        } else if (!isPaymentByHour && perHourChecked) {
            return false;
        }
        return true;
    }

    const handleDeadlineMinChange = (event: any) => {
        setDeadlineMin(event.target.value);
    }

    const handleDeadlineMaxChange = (event: any) => {
        setDeadlineMax(event.target.value);
    }

    function checkDeadlineInterval(deadline: number) {
        if (deadline >= (deadlineMin ? deadlineMin : 0) && deadline <= (deadlineMax ? deadlineMax : Number.POSITIVE_INFINITY)) {
            return true
        }
        return false;
    }

    const [abilities, setAbilities] = React.useState<any[]>([]);

    const handleDeleteSkill = (ability: string) => {
        let newSkills = abilities.filter(skill => skill !== ability);
        setAbilities(newSkills);
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
    };

    function checkSkills(skills: Skill[]) {
        if (abilities.length > 0) {
            let match = abilities.map(ability => {
                return !!(skills.filter(skill => skill.name === ability).length);
            });

            return !(match.filter(term => term === false).length);
        }
        return true;
    }

    const handleSearchQueryChange = (event: any) => {
        setSearchQuery(event.target.value)
    }

    function checkSearchQuery(title: string) {
        if (searchQuery && searchQuery.length > 0 && !title.includes(searchQuery)) {
            return false;
        }
        return true;
    }

    const [availableJobs, setAvailableJobs] = React.useState<Job[]>([]);

    const { myJobs } = useParams();

    const getJobs = async () => {
        try {
            if (currentUser.isFreelancer && myJobs === 'true') {
                var jobs: AxiosResponse<Job[]> = await axios.get(
                    Constants.BASE_URL + "api/job/list",
                    {
                        params: {
                            "userId": currentUser.id
                        }
                    }
                );
            } else if (currentUser.isFreelancer && myJobs === 'false') {
                var jobs: AxiosResponse<Job[]> = await axios.get(
                    Constants.BASE_URL + "api/job/search",
                    {
                        params: {
                            "userId": currentUser.id
                        }
                    }
                );
            } else {
                var jobs: AxiosResponse<Job[]> = await axios.get(
                    Constants.BASE_URL + "api/job/list",
                    {
                        params: {
                            "userId": currentUser.id
                        }
                    }
                );
            }
            return jobs;
        } catch (error: any) {
            throw new Error(error);
        }
    }

    useEffect(() => {
        if (!availableJobs.length) {
            getJobs().then(result => {
                setAvailableJobs(result.data)
            })
        }
    }, []);

    let navigate = useNavigate();

    const handleJobClick = (ref: string) => {
        if (ref.length > 0) {
            (currentUser.isFreelancer ? navigate("/freelancer-job-view/" + ref) : navigate("/client-job-view/" + ref));
        }
    };

    return (
        <Container>
            <Header />

            <Body>

                <LeftDiv style={{ width: "30%" }}>
                    <GrayPaper>
                        <Filters1>
                            Filtros
                        </Filters1>
                        <Filters2>
                            <TextField
                                id="outlined-select-currency"
                                select
                                label="Moeda"
                                value={currency}
                                onChange={handleCurrencyChange}
                                style={{ width: "100%" }}
                            >
                                {currencies.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Filters2>
                        <Filters3>
                            <div>
                                <FormControlLabel control={<Checkbox defaultChecked color="primary" onChange={() => handlePaymentMethodChange('total')} checked={totalChecked} />} label="Valor total" />
                            </div>
                            {currency} <CurrencyTextField onChange={handleTotalPaymentMinChange} value={totalPaymentMin} disabled={totalTextFieldDisable} id="outlined-basic1" variant="outlined" size="small" /> -
                            {currency} <CurrencyTextField onChange={handleTotalPaymentMaxChange} value={totalPaymentMax} disabled={totalTextFieldDisable} id="outlined-basic2" variant="outlined" size="small" />
                        </Filters3>
                        <Filters4>
                            <div>
                                <FormControlLabel control={<Checkbox data-testid="perhour-checkbox" color="primary" checked={perHourChecked} onChange={() => handlePaymentMethodChange('hour')} />} label="Por hora" />
                            </div>
                            {currency} <CurrencyTextField data-testid="perhourlower-input" onChange={handlePerHourPaymentMinChange} value={perHourPaymentMin} disabled={perHourTextFieldDisable} id="outlined-basic3" variant="outlined" size="small" /> /h -
                            {currency} <CurrencyTextField data-testid="perhourupper-input" onChange={handlePerHourPaymentMaxChange} value={perHourPaymentMax} disabled={perHourTextFieldDisable} id="outlined-basic4" variant="outlined" size="small" /> /h
                        </Filters4>
                        <Filters5>
                            Prazo
                        </Filters5>
                        <Filters6>
                            <CurrencyTextField data-testid="deadlinelower-input" onChange={handleDeadlineMinChange} value={deadlineMin} id="outlined-basic5" variant="outlined" size="small" /> dias -
                            <CurrencyTextField data-testid="deadlineupper-input" onChange={handleDeadlineMaxChange} value={deadlineMax} id="outlined-basic6" variant="outlined" size="small" /> dias
                        </Filters6>
                        <Filters7>
                            <Skills1>
                                Habilidades
                            </Skills1>
                            <Skills2>
                                <SkillField
                                    data-testid="skill-input"
                                    id="outlined-basic"
                                    variant="outlined"
                                    size="small"
                                    value={name}
                                    onChange={handleChange}
                                />
                                <StyledAddSkillButton
                                    data-testid="addskill-button"
                                    onClick={() => handleAddNewAbility(name)}
                                >+</StyledAddSkillButton>
                            </Skills2>
                            <Skills3>
                                <StyledList dense={true}>
                                    {abilities.map(ability => {
                                        return (
                                            <ListItem>
                                                <div style={{ height: "6%", width: "100%", display: "flex", alignItems: "center" }}>
                                                    <ListItemText
                                                        primary={ability}
                                                    />
                                                    <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteSkill(ability)}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </div>
                                            </ListItem>
                                        )
                                    }
                                    )}
                                </StyledList>
                            </Skills3>
                        </Filters7>
                    </GrayPaper>
                </LeftDiv>

                <RightDiv style={{ width: "70%" }}>
                    <div style={{ height: "20%" }}>
                        <FindJobsUp>
                            Encontre Jobs
                        </FindJobsUp>
                        <FindJobsBottom>
                            Escolha dentre centenas de opções de jobs o que melhor se adapta às suas habilidades e expectativa de ganho.
                        </FindJobsBottom>
                    </div>

                    <div style={{ height: "80%" }}>
                        <GrayPaper>
                            <JobsList1>
                                <SearchJobTextField
                                    data-testid="search-input"
                                    id="job-search"
                                    variant="outlined"
                                    size="small"
                                    placeholder="Pesquise Jobs disponíveis"
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <SearchIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                    onChange={handleSearchQueryChange}
                                    value={searchQuery}
                                />
                            </JobsList1>
                            <JobsList2>
                                <nav aria-label="main mailbox folders">
                                    <div style={{}}>
                                        <List dense={true}>
                                            {availableJobs.map(job => {
                                                if (checkPaymentInterval(job.payment) && checkPaymentType(job.isPaymentByHour) && checkDeadlineInterval(job.deadline) && checkSkills(job.skills) && checkSearchQuery(job.title)) {
                                                    return (
                                                        <ListItem key={job.id} style={{ display: "block" }}>
                                                            <ListItemDiv>
                                                                <ListItemButton data-testid={job.title + "-button"} onClick={() => handleJobClick(job.id)}>
                                                                    <ListItemText
                                                                        disableTypography
                                                                        primary={<Typography variant="h5" style={{ color: '#000000' }}>{job.title}</Typography>}
                                                                        secondary={<Typography style={{ color: '#000000', overflow: 'hidden', maxHeight: "48px" }}>{job.description}</Typography>}
                                                                    />
                                                                </ListItemButton>
                                                            </ListItemDiv>
                                                            <SkillsDiv>
                                                                {job.skills.map((skill: any) => {
                                                                    return (
                                                                        <div data-testid="skills-div" style={{ lineHeight: "28px", marginInline: "1%", marginBlock: "0.5%", borderRadius: "10px", backgroundColor: "#3f51b5", color: "white", maxHeight: "28px", paddingInline: "1%" }}>
                                                                            {skill.name}
                                                                        </div>
                                                                    )
                                                                })}
                                                            </SkillsDiv>
                                                            <Divider />
                                                        </ListItem>
                                                    )
                                                }
                                            })}
                                        </List>
                                    </div>
                                </nav>
                            </JobsList2>
                        </GrayPaper>
                    </div>

                </RightDiv>

            </Body>

            <Footer />
        </Container>
    );

};