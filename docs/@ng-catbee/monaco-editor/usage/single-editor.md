---
id: single-editor
title: Single Editor
sidebar_position: 2
---

## CatbeeMonacoEditor Example

### 1. Using [(ngModel)]

```ts
import { Component } from '@angular/core';
import { CatbeeMonacoEditor, MonacoEditorOptions, MonacoEditor, MonacoKeyMod, MonacoKeyCode } from '@ng-catbee/monaco-editor';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [CatbeeMonacoEditor, FormsModule],
  template: `
    <ng-catbee-monaco-editor
      [height]="'400px'"
      [width]="'100%'"
      [options]="options"
      [(ngModel)]="code"
      [language]="'javascript'"
      [placeholder]="'Start typing your code here...'"
      (init)="onInit($event)"
      (ngModelChange)="onValueChange($event)"
      (optionsChange)="onOptionsChange($event)"
    />

    <!-- Or with value binding -->

    <ng-catbee-monaco-editor
      [height]="'400px'"
      [width]="'100%'"
      [options]="options"
      [(value)]="code"
      [language]="'javascript'"
      [placeholder]="'Start typing your code here...'"
      (init)="onInit($event)"
      (valueChange)="onValueChange($event)"
      (optionsChange)="onOptionsChange($event)"
    />
  `,
})
export class AppComponent {
  options: MonacoEditorOptions = {
    theme: 'vs-dark',
    automaticLayout: true,
    minimap: { enabled: false }
  };

  code = `function hello() {\n  console.log('Hello, world!');\n}`;
  onInit(editor: MonacoEditor) {
    console.log('Editor initialized:', editor);

    editor.addCommand(MonacoKeyMod.CtrlCmd | MonacoKeyCode.KEY_S, () => {
      console.log('Ctrl+S pressed - implement save logic here');
    });
  }

  onOptionsChange(newOptions: MonacoEditorOptions) {
    console.log('Editor options changed:', newOptions);
  }

  onValueChange(newValue: string) {
    console.log('Editor value changed:', newValue);
  }
}
```

### 2. Using Reactive Forms

```ts
import { Component } from '@angular/core';
import { CatbeeMonacoEditor, MonacoEditorOptions } from '@ng-catbee/monaco-editor';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CatbeeMonacoEditor, ReactiveFormsModule],
  template: `
    <form [formGroup]="form">
      <ng-catbee-monaco-editor
        formControlName="code"
        [language]="'javascript'"
        [options]="options"
      />
    </form>
  `
})
export class AppComponent {
  options: MonacoEditorOptions = {
    theme: 'vs-dark'
  };

  form = new FormGroup({
    code: new FormControl('const x = 42;')
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
import { Component, signal } from '@angular/core';
import { Field, form, required, pattern } from '@angular/forms/signals';
import { CatbeeMonacoEditorV2, MonacoEditorOptions } from '@ng-catbee/monaco-editor';

@Component({
  selector: 'app-root',
  imports: [CatbeeMonacoEditorV2, Field],
  template: `
    <ng-catbee-monaco-editor-v2
      [height]="'400px'"
      [width]="'100%'"
      [options]="options"
      [field]="myForm"
    />
  `
})
export class AppComponent {
  options: MonacoEditorOptions = {
    language: 'typescript',
    theme: 'vs-dark',
    automaticLayout: true,
    minimap: { enabled: false }
  };

  singleModel = signal<string>('console.log("Hello, Signal Forms!");');

  myForm = form(this.singleModel, (path) => {
    required(path, { message: 'This field is required.' });
    pattern(path, {
      pattern: /alert/,
      message: 'The code must contain an alert statement.'
    });
  });
}
```
