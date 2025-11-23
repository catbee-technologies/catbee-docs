---
id: diff-editor
title: Diff Editor
sidebar_position: 3
---

## CatbeeMonacoDiffEditor Example

### 1. Using [(ngModel)]

```ts
import { Component } from '@angular/core';
import { CatbeeMonacoDiffEditor, MonacoDiffEditorOptions, CatbeeMonacoDiffEditorModel, CatbeeMonacoDiffEditorEvent } from '@ng-catbee/monaco-editor';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [CatbeeMonacoDiffEditor, FormsModule],
  template: `
    <ng-catbee-monaco-diff-editor
      [height]="'400px'"
      [width]="'100%'"
      [options]="options"
      [(ngModel)]="diffModel"
      [language]="'javascript'"
      (editorDiffUpdate)="onDiffUpdate($event)"
      [originalEditable]="false"
      [disabled]="false"
    />
  `
})
export class AppComponent {
  options: MonacoDiffEditorOptions = {
    theme: 'vs-dark',
    automaticLayout: true
  };

  diffModel: CatbeeMonacoDiffEditorModel = {
    original: 'function hello() {\n\talert("Hello, world!");\n}',
    modified: 'function hello() {\n\talert("");\n'
  };

  onDiffUpdate(event: CatbeeMonacoDiffEditorEvent) {
    console.log('Diff updated:', event.original, event.modified);
  }
}
```

### 2. Using Reactive Forms

```ts
import { Component } from '@angular/core';
import { CatbeeMonacoDiffEditor, MonacoDiffEditorOptions } from '@ng-catbee/monaco-editor';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CatbeeMonacoDiffEditor, ReactiveFormsModule],
  template: `
    <form [formGroup]="form">
      <ng-catbee-monaco-diff-editor
        formControlName="code"
        [language]="'javascript'"
        [options]="options"
      />
    </form>
  `
})
export class AppComponent {
  options: MonacoDiffEditorOptions = {
    theme: 'vs-dark',
    automaticLayout: true
  };

  form = new FormGroup({
    code: new FormControl({
      original: 'function hello() {\n\talert("Hello, world!");\n}',
      modified: 'function hello() {\n\talert("");\n}'
    })
  });

  constructor() {
    this.form.get('code')!.valueChanges.subscribe(value => {
      console.log('Reactive Form value changed:', value);
    });
  }
}
```

### 3. Using Signal Forms

```ts
import { Component, effect, signal } from '@angular/core';
import { Field, form, required, pattern } from '@angular/forms/signals';
import { CatbeeMonacoDiffEditorV2, MonacoDiffEditorOptions, CatbeeMonacoDiffEditorModel } from '@ng-catbee/monaco-editor';

@Component({
  selector: 'app-root',
  imports: [CatbeeMonacoDiffEditorV2, Field],
  template: `
    <ng-catbee-monaco-diff-editor-v2
      [height]="'400px'"
      [width]="'100%'"
      [options]="options"
      [field]="myForm"
    />
  `
})
export class AppComponent {
  options: MonacoDiffEditorOptions = {
    theme: 'vs-dark',
    automaticLayout: true
  };

  diffModel = signal<CatbeeMonacoDiffEditorModel>({
    original: 'function hello() {\n\talert("Hello, world!");\n}',
    modified: 'function hello() {\n\talert("");\n}'
  });

  myForm = form(this.diffModel, (path) => {
    required(path.original, { message: 'Original code is required.' });
    required(path.modified, { message: 'Modified code is required.' });
    pattern(path.original, {
      pattern: /alert/,
      message: 'The code must contain an alert statement.'
    });
    pattern(path.modified, {
      pattern: /alert/,
      message: 'The code must contain an alert statement.'
    });
  });

  constructor() {
    effect(() => {
      console.log('Signal Form value changed:', this.myForm().value());
    });
  }
}
```
