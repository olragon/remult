
import { FieldDefinitions } from "../column-interfaces";
import { IterateToArrayOptions, Unobserve } from "../context";
import { EntitySettings } from "../entity";
import { Filter } from "../filter/filter-interfaces";
import { Sort, SortSegment } from "../sort";
import { entityEventListener } from "../__EntityValueProvider";




/*
## Should work
[] when added DataControl decorator for category id - lost caption
[V] adapt value converter
[V] add display value to value converter
[V] remove readonly from columnDefs - and hijack it in Remult Angular
[V] make value list return a converter + benefits (Getoptions etc...)
[V] separate column and defs - defs will be property of column
[V] fix tests relevant to finding out the relationship between crud and specific apis,"allow api read depends also on api crud"
[V] "dbname of entity can use column names"
[V] test-paged-foreach
[V] fix validate to have the same parameter order as other things
[V] fix _items, to go away.
[V] "test make sort unique" - both tests
[V] fix allowApiUpdate for column to support additional info - so we can do only on new rows etc...
[V] "apiRequireId"
[V] return the test that was disabled by moving the server expression to remult 3- "get based on id virtual column async"
[V] consider sqlExpression where does it get the column name - see "test-sql-expression.spec.ts" line 41,47
[V] original data should reflect the values after server expressions
[V] replace method not allowed with forbidden - when something is not allowed
[V] add reflect metadata to dependencies
[V] prevent jobsInQueue to register as an api entity - it's not one
[V] think of id entity.
[V] rename `name` to `key` in Entity Settings
[V] replace entitydefs.name = key.
[V] rename allow api crud
[V] value converter no longer lambda
[V] caption - lambda
[V] storable to field Type
[V] value list field Type
[V] upgrade to angular 9 and ts 3.7


[V] column to field
[V] decimal field
[V] date only field

[] instead of row, use entity
[] test data control with number, make sure it updates on blur

[] use helmet instead of force https
[V] fix timeout by using a repeat mechanism in context.
[] test dateonly field decorator  on function parameter
[] "bool column doesn't need contains, isin and is not in"



## TODO

[V] "test object column"
[V] review repository api - and consider moving stuff to defs
[V] fix extends to be smarter
[V] "order by api"
[X] test default value set in the pojo itself: a=0;
[X] completed = false; didn't serialize as false to json



## Server Controller
[V] rebuild validation model for ServerMethod

## closed list column
[V] "Closed List  column"
[V] "test value list type"
[V] value list "works with automatic id"
[V] revive value list column tests "get array works with filter in body","get array works with filter in body and in array statement","get array works with filter in body and or statement"
[V]"getArray works with filter and in with closed list columns"
[V]"getArray works with filter and multiple values with closed list columns"

## compound id column
[V] "compound id"
[V] reconsider the IdColumn member - might make sense to remove it
[] sql database, update of row where id is not named id is compromised

## review with Yoni
[] entity allowed gets entity as second parameter, because allowed always get the context as first parameter
[] "negative decimal" - inputValue
[] "Number is always a number"
    [] "test number is always number"
    [] test number is always a number - settings value with any string, and then doing math options for it.
[] consider the setting decimal digits, instead might be useful to determine db storage - replaced with db type
[V] validationError is now called error
[] the inconsistenacy beyween Date and DateTime - in our naming and also with input management
[] rename context to remult
[] consider DbAutoIncrement to decorator
[] reconsider idColumn - maybe internalize it.
[] rowHelper naming
[] reconsider Item and Entity.
[] ColumnDefinitions vs ColumnOptions and same for entity
[] apiDataFilter
[] fixedFilter
[] consider a column that is saved to more than one column in the db
[] included display value and input type also in value converter - ias it is relevant to date only, and also value list
[] i make errors with the order of the generic parameters, entity, column and vice versa
[V] reconsider all the where stuff - just searh references for AndFilter to see the problem
[] with regards to the context init and setting the different things - maybe we should add an option to fail there and fail the request - for example in case the user info was updated since the last token was given and he has no rights any more etc...
[] consider the case when initing context, and cashing rows between requests, you might get a save to a context of a request two hours ago.
[] make where awaitable
[] custom context 
[] reconsider the custom filter with the FD
[] talk about allow null for date, object types, etc...
[] consider adding the count value in the response of the array


## consider if needed

[] consider the case where the name in restapi (json name) of a column is different from it's member - see commented test "json name is important"
[] reconsider if setting a value, clears the error member - see test ""validation clears on change"", "get based on id virtual column"
[] consider the previous functionalty of being aware of the id column type of the entity, to allow a short id lookup

## remult angular
[V] fix grid filter helper when filtering on a datetime column - to filter between today and tomorrow
[V] fix grid filter on string to be contains if not force equals - and same for object
[V] "test column value change"
[V]"test filter works with user filter"
[V]"test filter works with selected rows"
[V]"test select rows in page is not select all"
[V] "column drop down"
[V] "column drop down with promise"
[V] "column drop down with promise"
[V] "sort is displayed right on start"
[V] "sort is displayed right"
[V] "column drop down 1"
[V] "works ok with filter"
[V] "uses a saparate column"
[V] redesign extend 
[V] fix ignore id in id Entity
[V] fix sort method on grid settings
[V] fix getColumnsFromObject and it's usages
[V] make sure that column will be readonly if allowApiUpdateIsFalse
[V] data area with local columns "get value function works"
    [V] "test consolidate"
    [V] "works without entity"
    [V] "get value function works"

## remult angular future
[] change the getValue - to  displayValue
[] change the input type to support code+value, displayValueOnly











*/


export interface rowHelper<entityType> {
    hasErrors(): boolean;
    undoChanges();
    save(): Promise<entityType>;
    reload(): Promise<void>;
    delete(): Promise<void>;
    isNew(): boolean;
    wasChanged(): boolean;
    wasDeleted(): boolean;
    fields: EntityFields<entityType>;
    error: string;
    getId(): any;
    repository: Repository<entityType>;
    defs: EntityDefinitions<entityType>
    toApiJson(): any;
}
export type EntityFields<Type> = {
    [Properties in keyof Type]: EntityField<Type[Properties], Type>
} & {
    find(col: FieldDefinitions | string): EntityField<any, Type>,
    [Symbol.iterator]: () => IterableIterator<EntityField<any, Type>>



}
export type FieldDefinitionsOf<Type> = {
    [Properties in keyof Type]: FieldDefinitions
} & {
    find(col: FieldDefinitions | string): FieldDefinitions,
    [Symbol.iterator]: () => IterableIterator<FieldDefinitions>


}


export type sortOf<Type> = {
    [Properties in keyof Type]: SortSegment & { descending(): SortSegment }
}

export interface EntityField<T, entityType = any> {
    inputType: string;
    error: string;
    displayValue: string;
    value: T;
    originalValue: T;
    inputValue: string;
    wasChanged(): boolean;
    rowHelper: rowHelper<entityType>;
    entity: entityType;
    defs: FieldDefinitions<entityType>;
    load(): Promise<T>;
}

export interface EntityDefinitions<entityType = any> {
    readonly dbAutoIncrementId: boolean;
    readonly idField: FieldDefinitions<any>;
    getIdFilter(id: any): Filter;
    isIdField(col: FieldDefinitions): boolean;
    createIdInFilter(items: entityType[]): Filter;

    readonly key: string,
    readonly dbName: string,
    readonly fields: FieldDefinitionsOf<entityType>,
    readonly caption: string;
    readonly evilOriginalSettings: EntitySettings;
}
export interface Repository<entityType> {
    fromJson(x: any): entityType;

    defs: EntityDefinitions<entityType>;



    find(options?: FindOptions<entityType>): Promise<entityType[]>;
    iterate(options?: EntityWhere<entityType> | IterateOptions<entityType>): IteratableResult<entityType>;
    count(where?: EntityWhere<entityType>): Promise<number>;
    findFirst(where?: EntityWhere<entityType> | IterateOptions<entityType>): Promise<entityType>;
    findId(id: any): Promise<entityType>;
    findOrCreate(options?: EntityWhere<entityType> | IterateOptions<entityType>): Promise<entityType>;
    /**
 * Used to get non critical values from the Entity.
* The first time this method is called, it'll return a new instance of the Entity.
* It'll them call the server to get the actual value and cache it.
* Once the value is back from the server, any following call to this method will return the cached row.
* 
* It was designed for displaying a value from a lookup table on the ui - counting on the fact that it'll be called multiple times and eventually return the correct value.
* 
* * Note that this method is not called with `await` since it doesn't wait for the value to be fetched from the server.
* @example
* return  context.for(Products).lookup(p=>p.id.isEqualTo(productId));
 */
    lookup(filter: EntityWhere<entityType>): entityType;

    /** returns a single row and caches the result for each future call
  * @example
  * let p = await this.context.for(Products).lookupAsync(p => p.id.isEqualTo(productId));
  */
    lookupAsync(filter: EntityWhere<entityType>): Promise<entityType>;

    create(item?: Partial<entityType>): entityType;

    getCachedById(id: any): entityType;
    getCachedByIdAsync(id: any): Promise<entityType>;
    addToCache(item: entityType);


    getRowHelper(item: entityType): rowHelper<entityType>;
    save(entity: entityType): Promise<entityType>;
    delete(entity: entityType): Promise<void>;
    addEventListener(listener: entityEventListener<entityType>): Unobserve;
}
export interface FindOptions<T> {
    /** filters the data
     * @example
     * where p => p.price.isGreaterOrEqualTo(5)
     * @see For more usage examples see [EntityWhere](https://remult-ts.github.io/guide/ref_entitywhere)
     */
    where?: EntityWhere<T>;
    /** Determines the order in which the result will be sorted in
     * @see See [EntityOrderBy](https://remult-ts.github.io/guide/ref__entityorderby) for more examples on how to sort
     */
    orderBy?: EntityOrderBy<T>;
    /** Determines the number of rows returned by the request, on the browser the default is 25 rows 
     * @example
     * this.products = await this.context.for(Products).find({
     *  limit:10,
     *  page:2
     * })
    */
    limit?: number;
    /** Determines the page number that will be used to extract the data 
     * @example
     * this.products = await this.context.for(Products).find({
     *  limit:10,
     *  page:2
     * })
    */
    page?: number;
    __customFindData?: any;

}
/** Determines the order of rows returned by the query.
 * @example
 * await this.context.for(Products).find({ orderBy: p => p.name })
 * @example
 * await this.context.for(Products).find({ orderBy: p => [p.price, p.name])
 * @example
 * await this.context.for(Products).find({ orderBy: p => [{ field: p.price, descending: true }, p.name])
 */
export declare type EntityOrderBy<T> = (entity: sortOf<T>) => SortSegment[] | SortSegment;

/**Used to filter the desired result set
 * @example
 * where: p=> p.availableFrom.isLessOrEqualTo(new Date()).and(p.availableTo.isGreaterOrEqualTo(new Date()))
 */
export declare type EntityWhere<entityType> = ((entityType: filterOf<entityType>) => (Filter | Filter[]|EntityWhere<entityType>)) | EntityWhere<entityType>[];





export interface filterOptions<x> {
    isEqualTo(val: x): Filter;
    isDifferentFrom(val: x);
    isIn(val: x[]): Filter;
    isNotIn(val: x[]): Filter;
}

export interface comparableFilterItem<x> extends filterOptions<x> {


    isLessOrEqualTo(val: x): Filter;
    isLessThan(val: x): Filter;
    isGreaterThan(val: x): Filter;
    isGreaterOrEqualTo(val: x): Filter;
}
export interface supportsContains<x> extends filterOptions<x> {
    contains(val: string): Filter;
}

export type filterOf<Type> = {
    [Properties in keyof Type]: Type[Properties] extends number | Date ? comparableFilterItem<Type[Properties]> :
    Type[Properties] extends string ? (supportsContains<Type[Properties]> & comparableFilterItem<Type[Properties]>) :
    supportsContains<Type[Properties]>
}

export type ClassType<T> = { new(...args: any[]): T };

export interface IterateOptions<entityType> {
    where?: EntityWhere<entityType>;
    orderBy?: EntityOrderBy<entityType>;
    progress?: { progress: (progress: number) => void };
}
export interface IteratableResult<T> {
    toArray(options?: IterateToArrayOptions): Promise<T[]>;
    first(): Promise<T>;
    count(): Promise<number>;
    forEach(what: (item: T) => Promise<any>): Promise<number>;
    [Symbol.asyncIterator](): {
        next: () => Promise<IteratorResult<T>>;
    };
}

export class InputTypes {
    static number = 'number';
    static date = 'date';
    static checkbox = 'checkbox';
    static password = 'password';
    static email = 'email';
    static tel = 'tel';
    static time = "time";
}
export function set<T>(item: T, valuesToSet: Partial<T>): T {
    if (valuesToSet)
        Object.assign(item, valuesToSet);
    return item;
}