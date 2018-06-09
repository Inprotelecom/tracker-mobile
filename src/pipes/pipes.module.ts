import { NgModule } from '@angular/core';
import { PipeComboValuePipe } from './pipe-combo-value-pipe-ts/pipe-combo-value-pipe';
import { ImageStringPipe } from './image-string/image-string';
import { TrackerImagesPipe } from './tracker-images/tracker-images';
@NgModule({
	declarations: [PipeComboValuePipe,
    ImageStringPipe,
    TrackerImagesPipe],
	imports: [],
	exports: [PipeComboValuePipe,
    ImageStringPipe,
    TrackerImagesPipe]
})
export class PipesModule {}
