import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ApolloModule } from "apollo-angular";
import { MaterialModule } from "../material/material.module";
import { TokenStorageService } from "./token-storage.service";

@NgModule({
  imports: [MaterialModule, CommonModule, ApolloModule],
  declarations: [],
  providers: [TokenStorageService],
  exports: [MaterialModule, ApolloModule]
})
export class SharedModule {}
