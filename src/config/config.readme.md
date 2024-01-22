
# Модуль конфигурации backend AskIT

Данная документация объясняет как работать с переменными окружения в проекте.

---
## Импорт модуля конфигурации

В качестве модуля конфигурации используется библиотека `nest-typed-config` которая является оберткой над `@nestjs/config`. Стандартное решение от Nest имеет недостаток в виде слабой типизации и невозможности использовать загруженные переменные вне модулей NestJS.

Документация по библиотеке `nest-typed-config` должна быть доступна по адресу https://www.npmjs.com/package/nest-typed-config.

---
## Описание класса конфигурации

Из `config.ts` экспортируется класс `RootConfig` который представляет собой репрезентацию конфиг-файла используя инструменты `class-validator` & `class-transformer`. 

При **добавлении нового параметра** необходимо:

*Не добавляя вложенность*: 
1. Добавить в `RootConfig` - `public readonly $variableName!: $variableType;`; Заменив `variableName` и `variableType` на соответсвующие.

*Добавляя вложенность*:
1. Создать новый класс соответствующий названию вложенности в yaml конфиге. Например мы добавляем объект rules
```yaml
rules:
	maxCardsLimit: 10
	damageMultiplierByTurn: 1.3
```
2. По пути `src/config/config.ts` добавить новый класс описывающий данные параметры
```ts
export class RulesConfig {
	@IsNumber()
	@Allow()
	public readonly maxCardsLimit!: number;

	@IsNumber()
	@Allow()
	public readonly damageMultiplierByTurn!: number;
}
```
3. По пути `src/config/config.ts` модифицировать `RootConfig` добавив наш новый класс
```ts
export class RootConfig {
	// ...то, что было ранее

	@Type(() => RulesConfig)
	@ValidateNested()
	public readonly rules!: RulesConfig;
}
```
Не забываем декораторы `ValidateNested` и `Type`.
Без `Allow` декоратора у нас не получится использовать вложенные параметры.

По желанию добавляем новый селектор по пути `src/config/config.module.ts`
```ts
// ...
export const rulesConfig = selectConfig(ConfigModule, RulesConfig);
```

