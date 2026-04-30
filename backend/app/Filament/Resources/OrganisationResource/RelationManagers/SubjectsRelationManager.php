<?php

namespace App\Filament\Resources\OrganisationResource\RelationManagers;

use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;

class SubjectsRelationManager extends RelationManager
{
    protected static string $relationship = 'subjects';

    protected static ?string $recordTitleAttribute = 'subject_id';

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('subject_id')
                    ->label('Subject ID')
                    ->required()
                    ->maxLength(255),
                Forms\Components\TextInput::make('job_role')->maxLength(255),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('subject_id')
                    ->label('Subject ID')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('job_role')->toggleable(),
                Tables\Columns\TextColumn::make('assessment_sessions_count')
                    ->counts('assessmentSessions')
                    ->label('Sessions'),
                Tables\Columns\TextColumn::make('created_at')->dateTime()->sortable()->toggleable(),
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
