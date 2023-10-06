import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'truncate'
})

export class TruncatePipe implements PipeTransform {

    transform(value: string, length: number): string {
        let limit = length ? length : 5;
        let trail = '...';
        return value.length > limit ? value.substring(0, limit) + trail : value;
    }
}