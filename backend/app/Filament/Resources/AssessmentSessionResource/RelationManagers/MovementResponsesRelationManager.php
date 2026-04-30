<?php

namespace App\Filament\Resources\AssessmentSessionResource\RelationManagers;

use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;

class MovementResponsesRelationManager extends RelationManager
{
    protected static string $relationship = 'movementResponses';

    protected static ?string $title = 'Movement responses';

    protected static ?string $recordTitleAttribute = 'id';

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Select::make('movement_id')
                    ->label('Movement')
                    ->relationship('movement', 'name')
                    ->required()
                    ->searchable()
                    ->preload(),
                Forms\Components\Toggle::make('no_issues')
                    ->label('No issues reported'),
                Forms\Components\Select::make('bodyZones')
                    ->label('Body zones with discomfort')
                    ->multiple()
                    ->relationship('bodyZones', 'name')
                    ->preload()
                    ->columnSpanFull(),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('movement.name')
                    ->label('Movement')
                    ->sortable(),
                Tables\Columns\IconColumn::make('no_issues')->boolean(),
                Tables\Columns\TextColumn::make('body_zones_count')
                    ->counts('bodyZones')
                    ->label('Zones'),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable(),
            ])
            ->headerActions([
                Tables\Actions\CreateAction::make(),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }
}
