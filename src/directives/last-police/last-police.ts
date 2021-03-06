import { Directive, Input} from '@angular/core';
import { Manager } from '../../providers/manager';
import { AppNotify } from '../../app/app-notify';
/*
  Generated class for the LastPoliceDirective directive.

  See https://angular.io/docs/ts/latest/api/core/index/DirectiveMetadata-class.html
  for more info on Angular 2 Directives.
*/
@Directive({
  selector: '[last-police]' // Attribute selector
})
export class LastPoliceDirective {
  @Input()
  displayed: any;
  constructor(
    public manager: Manager,
    public appNotify: AppNotify,    
  ) {
    console.log('Hello LastPoliceDirective Directive');
  }

  ngOnChanges() {
    if (!this.displayed)
      return;
    this.displayed.loadedPolice = false;
    this.manager.getPoliceAssurance(this.displayed.id).then((data) => {
      this.displayed.police = data;
      this.displayed.loadedPolice = true;
      this.joursRestant(this.displayed.police);
      this.duree(this.displayed.police);
    }, error => {
      this.appNotify.onSuccess({ message: "Problème ! Verifiez votre connexion internet." })
    })

  }
  joursRestant(objet: any) {
    if (!objet)
      return;
    let diffDays = Math.ceil((new Date(objet.endDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
    objet.restant = diffDays;
    this.setColorIcon(objet);
  }

  duree(objet: any) {
    if (!objet)
      return;
    let diffDays = Math.ceil((new Date(objet.endDate).getTime() - new Date(objet.startDate).getTime()) / (1000 * 3600 * 24));
    objet.duree = diffDays;
  }



  setColorIcon(objet: any) {
    let n = objet.restant;
    if (n >= 0 && n < 3) {
      objet.color = "primary";
      objet.icon = "ios-warning-outline";
      return;
    }
    else if (n >= 3 && n < 15) {
      objet.color = "orange";
      objet.icon = "ios-warning";
      return;
    }
    objet.color = "danger";
  }

  ngOnInit() {
    this.ngOnChanges();
  }
}
