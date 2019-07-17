import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ApolloModule } from 'apollo-angular';
import { MaterialModule } from '../material/material.module';
import { MenuComponent } from './menu/menu.component';
import { TokenStorageService } from './token-storage.service';

@NgModule({
  imports: [MaterialModule, RouterModule, CommonModule, ApolloModule],
  declarations: [MenuComponent],
  providers: [TokenStorageService],
  exports: [MaterialModule, ApolloModule, MenuComponent]
})
export class SharedModule {}
