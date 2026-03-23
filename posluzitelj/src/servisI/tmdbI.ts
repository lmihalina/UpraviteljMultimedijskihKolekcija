export interface FilmoviTmdbI 
{
    page:number;
    results:Array<FilmTmdbI>;
    total_pages:number;
    total_results:number;
}

export interface FilmTmdbI 
{
    adult:boolean;
    backdrop_path:string;
    genre_ids:Array<number>;
    id:number;
    original_language:string;
    original_title:string;
    overview:string;
    popularity:number;
    poster_path:string;
    release_date:string;
    title:string;
    video:boolean;
    vote_average:number;
    vote_count:number;
}

export interface VideoTmdbI
{
    iso_639_1 : string;
    iso_3166_1 : string;
    name : string;
    key : string;
    site : string;
    size : number;
    type : string;
    official : boolean;
    published_at : string;
    id : string;
}

export interface OdgovorVideoTmdbI
{
    id: number;
    results: Array<VideoTmdbI>;
}