const fs = require("fs");
const inquirer = require("inquirer");
const path = require("path");
const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const render = require("./lib/htmlRender");
const DIROUTPUT = path.resolve(__dirname, "output");
const pathOutput = path.join(DIROUTPUT, "team.html");

let EmpArray = new Array();

const EmpQuestions = [
    {
        type: "input",
        message: "Enter the name of the employee, please:",
        name: "name"
    },
    {
        type: "input",
        message: "Enter the id of employee, please:",
        name: "id"
    },
    {
        type: "input",
        message: "Enter the email address of employee, please:",
        name: "email"
    },
    {
        type: "list",
        message: "Please select from the list a position for this employee:",
        name: "role",
        choices: [
            "Manager",
            "Engineer",
            "Intern"
        ]
    }
]

const ManagerQuestions = [
    {
        type: "input",
        message: "Enter the office phone number for the manager, please:",
        name: "officeNumber"
    }
]

const EngineerQuestions = [
    {
        type: "input",
        message: "Please enter GitHub user name for the engineer:",
        name: "github"
    }
]

const init = () => {
    if (fs.existsSync(pathOutput)) {
        inquirer.prompt({
            type: "list",
            message: "Would you like to overwrite the existing team.html file as it already exists?",
            name: "overwrite",
            choices: [
                "Yes",
                "No"
            ]
        }).then(async (response) => {

            let overwrite = response.overwrite;
            if (await overwrite === 'Yes') {
                console.log("Welcome, enter your team information below:")
                inquiryEmployees()
            } else if (await overwrite === 'No') {
                console.log("The team.html file has not been overwritten.")
            }
        })
    } else {
        console.log("Welcome to the team profile generator. Please enter your team information below:")
        inquiryEmployees()
    }
}

const inquiryEmployees = async () => {
    await inquirer.prompt(EmpQuestions).then((response) => {
        let name = response.name;
        let id = response.id;
        let email = response.email;
        let role = response.role;
        let officeNumber;
        let github;
        let school;

    
        if (role === 'Manager') {
            inquirer.prompt(ManagerQuestions).then((response) => {
                officeNumber = response.officeNumber;
                let employee = new Manager(name, id, email, officeNumber);
                EmpArray.push(employee);
                CreateHTML(EmpArray);
            })
        } else if (role === 'Engineer') {
            inquirer.prompt(EngineerQuestions).then((response) => {
                github = response.github;
                let employee = new Engineer(name, id, email, github);
                EmpArray.push(employee);
                CreateHTML(EmpArray);
            })
        } else if (role === 'Intern') {
            inquirer.prompt(InternQuestions).then((response) => {
                school = response.school;
                let employee = new Intern(name, id, email, school);
                EmpArray.push(employee);
                CreateHTML(EmpArray);
            })
        }
    });
}

const CreateHTML = async (array) => {
    await inquirer.prompt([
        {
            type: "list",
            message: "Would you like to create another employee?",
            name: "CreateEmployee",
            choices: [
                "Yes",
                "No"
            ]
        }
    ]).then(async (response) => {
        var CreateAnotherNewEmployee = response.CreateEmployee;

        if (await CreateAnotherNewEmployee === 'Yes') {
            inquiryEmployees();
        } else if (await CreateAnotherNewEmployee === 'No') {

            if (!fs.existsSync(DIROUTPUT)) {
                fs.mkdirSync(DIROUTPUT)
            }
            
            fs.writeFile(pathOutput, render(array), (err) => {
        
                if (err) {
                    return console.log(err); 
                }
            
                console.log("A team.html file was created and placed in the output folder.");
            });

        }
    })
}

init()