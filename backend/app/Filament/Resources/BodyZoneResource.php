<?php

namespace App\Filament\Resources;

use App\Filament\Resources\BodyZoneResource\Pages;
use App\Models\BodyZone;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\Str;

class BodyZoneResource extends Resource
{
    protected static ?string $model = BodyZone::class;

    protected static ?string $recordTitleAttribute = 'name';

    protected static ?string $navigationIcon = 'heroicon-o-map';

    protected static ?string $navigationGroup = 'Catalog';

    protected static ?int $navigationSort = 4;

    private const SIDES = [
        'front' => 'Front',
        'back' => 'Back',
        'side' => 'Side',
    ];

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('name')
                    ->required()
                    ->maxLength(255)
                    ->live(onBlur: true)
                    ->afterStateUpdated(function (?string $state, Forms\Set $set, ?string $old, $get) {
                        if (! filled($state)) {
                            return;
                        }
                        if (blank($get('slug')) || $get('slug') === Str::slug((string) $old)) {
                            $set('slug', Str::slug($state));
                        }
                    }),
                Forms\Components\TextInput::make('slug')
                    ->required()
                    ->maxLength(255)
                    ->unique(ignoreRecord: true),
                Forms\Components\Select::make('side')
                    ->options(self::SIDES)
                    ->required()
                    ->native(false),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('slug')
                    ->searchable()
                    ->toggleable(),
                Tables\Columns\TextColumn::make('side')
                    ->badge()
                    ->sortable()
                    ->color(fn (string $state): string => match ($state) {
                        'front' => 'info',
                        'back' => 'warning',
                        'side' => 'success',
                        default => 'gray',
                    }),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('side')->options(self::SIDES),
            ])
            ->defaultSort('side')
            ->actions([
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListBodyZones::route('/'),
            'create' => Pages\CreateBodyZone::route('/create'),
            'edit' => Pages\EditBodyZone::route('/{record}/edit'),
        ];
    }
}
