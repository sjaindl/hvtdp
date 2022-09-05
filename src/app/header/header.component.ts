import { Component } from '@angular/core'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
   width = '0px'

   navChanged(opened: boolean) {
     this.width = opened ? '100%' : '0px'
   }
}
