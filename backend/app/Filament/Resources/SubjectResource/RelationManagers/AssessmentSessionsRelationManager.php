<?php

namespace App\Filament\Resources\SubjectResource\RelationManagers;

use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;

class AssessmentSessionsRelationManager extends RelationManager
{
    protected static string $relationship = 'assessmentSessions';

    protected static ?string $title = 'Assessment sessions';

    protected static ?string $recordTitleAttribute = 'id';

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Select::make('garment_id')
                    ->label('Garment')
                    ->relationship('garment', 'name')
                    ->searchable()
                    ->preload()
                    ->required()
                    ->live()
                    ->afterStateUpdated(fn (Forms\Set $set) => $set('size_id', null)),
                Forms\Components\Select::make('size_id')
                    ->label('Size')
                    ->options(fn (Forms\Get $get) => \App\Models\Size::query()
                        ->where('garment_id', $get('garment_id'))
                        ->pluck('name', 'id'))
                    ->required(),
                Forms\Components\DateTimePicker::make('started_at'),
                Forms\Components\DateTimePicker::make('completed_at'),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('id')->sortable(),
                Tables\Columns\TextColumn::make('garment.name')->label('Garment')->sortable(),
                Tables\Columns\TextColumn::make('size.name')->label('Size')->sortable(),
                Tables\Columns\IconColumn::make('completed_at')
                    ->label('Completed')
                    ->boolean()
                    ->getStateUsing(fn ($record) => $record->completed_at !== null),
                Tables\Columns\TextColumn::make('movement_responses_count')
                    ->counts('movementResponses')
                    ->label('Responses'),
                Tables\Columns\TextColumn::make('started_at')->dateTime()->sortable(),
                Tables\Columns\TextColumn::make('completed_at')->dateTime()->sortable()->toggleable(),
            ])
            ->defaultSort('started_at', 'desc')
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
