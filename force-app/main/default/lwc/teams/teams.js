import { LightningElement } from 'lwc';

export default class Teams extends LightningElement {
    newMemberHandler(event) {
        console.log('GP Event Detail::::::');
        console.log(event);
        console.log(event.detail);
        console.log(JSON.parse(event.detail));
        this.template.querySelector("c-team-list").newMember = JSON.parse(event.detail);
        this.template.querySelector("c-team-list").addNewTeamMember();
    }
}