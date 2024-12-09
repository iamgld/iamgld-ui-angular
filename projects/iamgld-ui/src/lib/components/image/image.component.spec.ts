import { type ComponentFixture, TestBed } from '@angular/core/testing'

import { ImageComponent } from './image.component'

describe('ImageComponent', () => {
	let component: ImageComponent
	let fixture: ComponentFixture<ImageComponent>

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [ImageComponent],
		})
		fixture = TestBed.createComponent(ImageComponent)
		component = fixture.componentInstance
		fixture.detectChanges()
	})

	it('should create', () => {
		expect(component).toBeTruthy()
	})
})
