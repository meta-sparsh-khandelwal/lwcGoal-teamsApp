import { LightningElement, wire, track } from 'lwc';
import getTeamNames from '@salesforce/apex/TeamsAppService.getTeamNames';
import saveTeam from '@salesforce/apex/TeamsAppService.saveTeam';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class MemberSkills extends LightningElement {
    name;
    team;
    skills;
    @track hasTeams;
    insertedTeamMember=undefined;
    @track teamOptions;
    @wire(getTeamNames)
    wiredTeamOptions({ data, error }) {
        if (data) {
            console.log(data);
            console.log(this.teamOptions);
            this.teamOptions = data.map((name) => {
                return { label: name, value: name };
            });
            console.log("DATA::::::::::::!!!!!!!!!!!!!!!!!!");
            console.log(data);
            console.log(JSON.stringify(this.teamOptions));
            this.hasTeams = true;
        }
        else if (error) {
            this.hasTeams = false;
        }
    }
    handleNameChange(event) {
        this.name = event.detail.value;
    }
    handleTeamChange(event) {
        this.team = event.detail.value;
    }
    handleSkillChange(event) {
        this.skills = event.detail.value;
    }
    handleClick() {

        if (!(this.name && this.team && this.skills)) {
            const event = new ShowToastEvent({
                title: 'Error!!',
                message:
                    'Please fill out all fields',
                variant: 'error'
            });
            this.dispatchEvent(event);
        }

        else {
            let newTeamMember = { name: this.name, team: this.team, skills: this.skills };
            console.log('Saving New Member');
            console.log(newTeamMember);

            saveTeam({ team: JSON.stringify(newTeamMember) })
                .then(result => {
                    const event = new ShowToastEvent({
                        title: 'TeamMember Registered Successfully',
                        message:
                            result.Id + 'Created TeamMember',
                        variant: 'success'
                    });
                    console.log('Result returned:::::!!!!!!!!');
                    console.log(result);
                    console.log(JSON.stringify(result));
                    this.insertedTeamMember = result;
                    console.log(this.insertedTeamMember);
                    this.dispatchEvent(event);
                    this.dispatchEvent(new CustomEvent('membersubmit', {detail: JSON.stringify(this.insertedTeamMember)}));
                })
                .catch(error => {
                    const event = new ShowToastEvent({
                        title: 'Error!!',
                        message:
                            error.body.message + ' error occured',
                        variant: 'error'
                    });
                    this.dispatchEvent(event);
                    console.log(error);
                });
            this.name = '';
            this.team = '';
            this.skills = undefined;
        }
    }
}