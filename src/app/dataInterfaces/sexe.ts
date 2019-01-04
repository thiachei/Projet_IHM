export var sexeEnum: Genre[] = [
    {id:'M', value:'Homme'},
    {id:'F', value:"Femme"},
    {id:'A', value: "Non-binaire"}
];
sexeEnum['M'] = {id:'M', value:'Homme'};
sexeEnum['F'] = {id:'F', value:"Femme"};
sexeEnum['A'] = {id:'A', value: "Non-binaire"};

export interface Genre {
    id: string;
    value: string;
}