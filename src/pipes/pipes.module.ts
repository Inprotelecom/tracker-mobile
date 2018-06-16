import { NgModule } from '@angular/core';
import { PipeComboValuePipe } from './pipe-combo-value-pipe-ts/pipe-combo-value-pipe';
import { ImageStringPipe } from './image-string/image-string';
import { TrackerImagesPipe } from './tracker-images/tracker-images';
import { EscapeHtmlPipe } from './escape-html/escape-html';
import { IndentationPipe } from './indentation/indentation';
@NgModule({
	declarations: [PipeComboValuePipe,
    ImageStringPipe,
    TrackerImagesPipe,
    EscapeHtmlPipe,
    IndentationPipe],
	imports: [],
	exports: [PipeComboValuePipe,
    ImageStringPipe,
    TrackerImagesPipe,
    EscapeHtmlPipe,
    IndentationPipe]
})
export class PipesModule {}
