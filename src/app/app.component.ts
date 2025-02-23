// Angular Imports
import { Component, inject, signal, viewChild, OnInit } from '@angular/core'
import {
  FormControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms'
// @iamgld/ui  Imports
import {
  ButtonComponent,
  IconButtonComponent,
  InputComponent,
  InputHintComponent,
  InputErrorComponent,
  InputDateComponent,
  TextareaComponent,
  isDateValidator,
  RadioGroupComponent,
  RadioButtonComponent,
  SelectComponent,
  SelectOptionComponent,
  InputErrorMessageDirective,
  TileComponent,
  Icons,
  LoaderComponent,
  LinkComponent,
  ToggleGroupComponent,
  ToggleButtonComponent,
  DropdownMenuComponent,
  DropdownButtonComponent,
  TableComponent,
  TableColumn,
  TableColumnActionOutput,
  TableColumnActionType,
  TableColumnStructure,
  TablePagination,
} from '@iamgld/ui'

const components = [
  ButtonComponent,
  LinkComponent,
  IconButtonComponent,
  InputComponent,
  InputHintComponent,
  InputErrorComponent,
  InputDateComponent,
  TextareaComponent,
  RadioGroupComponent,
  RadioButtonComponent,
  SelectComponent,
  SelectOptionComponent,
  TileComponent,
  LoaderComponent,
  ToggleGroupComponent,
  ToggleButtonComponent,
  DropdownMenuComponent,
  DropdownButtonComponent,
  TableComponent,
]

const directives = [InputErrorMessageDirective]

@Component({
  selector: 'gld-app',
  imports: [ReactiveFormsModule, ...components, ...directives],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  readonly #fb = inject(NonNullableFormBuilder)
  readonly Icons = Icons

  readonly tableComponent = viewChild(TableComponent)
  readonly form = this.#fb.group<Form>({
    firstName: this.#fb.control('', { validators: [Validators.required] }),
    lastName: this.#fb.control('', { validators: [Validators.required] }),
    date: this.#fb.control('', { validators: [Validators.required, isDateValidator()] }),
    comments: this.#fb.control('', { validators: [Validators.required] }),
    agree: this.#fb.control({ value: '', disabled: false }, { validators: [Validators.required] }),
    gender: this.#fb.control('', { validators: [Validators.required] }),
  })

  readonly genders = signal<FormSelectOption[]>([
    { label: 'Masculino', value: 'male' },
    { label: 'Femenino', value: 'female' },
  ])

  loading = signal(true)
  jobs = signal<Job[]>([
    {
      id: 1,
      position: 'Frontend Developer',
      companyName: 'CFOTech Latam',
      companyUrl: 'https://www.linkedin.com/company/cfo-tech-latam',
      duration: 'September 2024 - Currently',
      language: 'english',
      stateId: 2,
    },
    {
      id: 3,
      position: 'Frontend Tech lead',
      companyName: 'Syloper',
      companyUrl: 'https://www.linkedin.com/company/syloper',
      duration: 'November 2022 - April 2023',
      language: 'english',
      stateId: 1,
    },
    {
      id: 4,
      position: 'SSR Frontend Developer',
      companyName: 'Syloper',
      companyUrl: 'https://www.linkedin.com/company/syloper',
      duration: 'January 2022 - November 2022',
      language: 'english',
      stateId: 1,
    },
    {
      id: 5,
      position: 'JR Frontend Developer',
      companyName: 'Syloper',
      companyUrl: 'https://www.linkedin.com/company/syloper',
      duration: 'June 2021 - January 2022',
      language: 'english',
      stateId: 1,
    },
    {
      id: 6,
      position: 'Frontend Developer',
      companyName: 'CFOTech Latam',
      companyUrl: 'https://www.linkedin.com/company/cfo-tech-latam',
      duration: 'Septiembre 2024 - Actualmente',
      language: 'spanish',
      stateId: 2,
    },
    {
      id: 2,
      position: 'Frontend Developer',
      companyName: 'Vemo',
      companyUrl: 'https://www.linkedin.com/company/vemovilidad',
      duration: 'May 2023 - August 2024',
      language: 'english',
      stateId: 1,
    },
    {
      id: 8,
      position: 'Frontend Tech lead',
      companyName: 'Syloper',
      companyUrl: 'https://www.linkedin.com/company/syloper',
      duration: 'Noviembre 2022 - Abril 2023',
      language: 'spanish',
      stateId: 1,
    },
    {
      id: 9,
      position: 'SSR Frontend Developer',
      companyName: 'Syloper',
      companyUrl: 'https://www.linkedin.com/company/syloper',
      duration: 'Enero 2022 - Noviembre 2022',
      language: 'spanish',
      stateId: 1,
    },
    {
      id: 10,
      position: 'JR Frontend Developer',
      companyName: 'Syloper',
      companyUrl: 'https://www.linkedin.com/company/syloper',
      duration: 'Junio 2021 - Enero 2022',
      language: 'spanish',
      stateId: 1,
    },
    {
      id: 7,
      position: 'Frontend Developer',
      companyName: 'Vemo',
      companyUrl: 'https://www.linkedin.com/company/vemovilidad',
      duration: 'Mayo 2023 - Agosto 2024',
      language: 'spanish',
      stateId: 1,
    },
  ])
  tableColumns = signal<TableColumn[]>([])
  tablePagination = signal<TablePagination>({
    itemsPerPage: 10,
    initialPage: 1,
    maxItems: 100,
  })

  constructor() {
    // console.log('date', this.form.controls.date)
    // this.form.controls.date.statusChanges.subscribe((status) => {
    //   console.log('status', status)
    //   console.log('toggle', this.form.controls.toggle)
    // })
  }

  ngOnInit() {
    this.#buildTableColumns({ jobs: this.jobs() })
  }

  logValue(value: unknown) {
    console.log('Logged Value:', value)
  }

  transformSelect(value: unknown): string {
    const formSelectOption = value as FormSelectOption
    return String(formSelectOption.label)
  }

  submit() {
    if (this.form.valid) {
      console.log(this.form.value)
    } else {
      this.form.markAllAsTouched()
      this.form.markAsDirty()
    }
  }

  tableColumnAction(event: TableColumnActionOutput) {
    const data = event.object as Job
    switch (event.tableColumnAction.type) {
      case TableColumnActionType.delete:
        console.log('action delete', data)
        break
      case TableColumnActionType.show:
        console.log('action show', data)
        break
      case TableColumnActionType.update:
        console.log('action update', data)
        break
      case TableColumnActionType.open:
        console.log('action open', data)
        break
    }
  }

  #buildTableColumns({ jobs }: { jobs: Job[] }) {
    const tableColumnStructures: TableColumnStructure[] = [
      {
        name: 'id',
        label: 'ID',
        width: '100px',
      },
      {
        name: 'position',
        label: 'Position',
        width: '150px',
      },
      {
        name: 'companyName',
        label: 'Company name',
        width: 'auto',
      },
      {
        name: 'duration',
        label: 'Duration',
        width: '150px',
      },
      {
        name: 'language',
        label: 'Language',
        width: '150px',
      },
    ]
    const tableColumns: TableColumn[] | undefined = this.tableComponent()?.buildTableColumns<Job>({
      tableColumnStructures,
      tableColumnActions: [
        {
          label: 'open',
          icon: Icons.eyeLine,
          type: TableColumnActionType.open,
          showWhen: () => true,
        },
        {
          label: 'update',
          icon: Icons.editLine,
          type: TableColumnActionType.update,
          showWhen: () => true,
        },
        {
          label: 'delete',
          icon: Icons.deleteBinLine,
          type: TableColumnActionType.delete,
          showWhen: () => true,
        },
      ],
      dataStructures: jobs,
    })
    // We update the column's variable
    if (tableColumns) this.tableColumns.set(tableColumns)
    this.loading.set(false)
    // setTimeout(() => {
    //   this.loading.set(false)
    // }, 2000)
  }
}

interface Form {
  firstName: FormControl<string>
  lastName: FormControl<string>
  date: FormControl<string>
  comments: FormControl<string>
  agree: FormControl<string>
  gender: FormControl<string>
}

export interface FormSelectOption {
  value: string
  label: string
}

export interface Job {
  id: number
  position: string
  companyName: string
  companyUrl: string
  duration: string
  language: 'english' | 'spanish'
  stateId: number
}
