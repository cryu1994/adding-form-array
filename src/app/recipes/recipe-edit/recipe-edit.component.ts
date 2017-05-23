import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import {FormControl, FormGroup, FormArray} from '@angular/forms';
import {RecipeService } from '../recipe.service'; // make sure to import the service or it will throw an error

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {
  id: number; // stored the id to use it later
  editMode = false;
  recipeForm: FormGroup; // assgin the recipeform to the formgruop

  constructor(private route: ActivatedRoute,
  private recipeService: RecipeService) { } // injecting serrvice to use the recipe service

  ngOnInit() {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.id = +params['id'];
          this.editMode = params['id'] != null;
          this.initForm();
        }
      );
  }

  onSubmit() {
    console.log(this.recipeForm);
  }

  // created a method called initForm to initialize to add or edit
  private initForm() {
    let recipeName = ''; // empty string by default
    let recipeImagePath = '';
    let recipeDescription = '';
    let recipeIngredients = new FormArray([]); // initializing form array as defalut of empty array.

    // used if statement to see if we are in a edit mode or add mode
    if (this.editMode) {
      const recipe = this.recipeService.getRecipe(this.id); // fetching the servvice to get the id of the recipe
      recipeName = recipe.name; // overwriting everything if we are in da edit mode.
      recipeImagePath = recipe.imagePath;
      recipeDescription = recipe.description;

      // if ingredient has been defind, then go through all the ingredient and push them in to new ingredient form
      if (recipe['ingredients']) {
        for (let ingredient of recipe.ingredients){
          recipeIngredients.push(
            new FormGroup({
              'name': new FormControl(ingredient.name),
              'amount': new FormControl(ingredient.amount)
            })
          );
        }
      }
    }

    // this will give us a outer shell of our form, this takes js object key value pair
    this.recipeForm = new FormGroup({
      'name': new FormControl(recipeName), // registering the name and path and the image path as default value.
      'imagePath': new FormControl(recipeImagePath),
      'description': new FormControl(recipeDescription),
      'ingredients': recipeIngredients // assgining ingredient control
    });
  }

}
