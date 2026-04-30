<?php

namespace App\Filament\Resources;

use App\Filament\Resources\AssessmentSessionResource\Pages;
use App\Filament\Resources\AssessmentSessionResource\RelationManagers;
use App\Models\AssessmentSession;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class AssessmentSessionResource extends Resource
{
    protected static ?string $model = AssessmentSession::class;

    protected static ?string $navigationIcon = 'heroicon-o-clipboard-document-check';

    protected static ?string $navigationGroup = 'Subjects & Assessments';

    protected static ?int $navigationSort = 1;

    protected static ?string $modelLabel = 'Assessment session';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Select::make('subject_id')
                    ->label('Subject')
                    ->relationship('subject', 'subject_id')
                    ->searchable()
                    ->preload()
                    ->required(),
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
                    ->searchable()
                    ->required(),
                Forms\Components\DateTimePicker::make('started_at')->seconds(false),
                Forms\Components\DateTimePicker::make('completed_at')->seconds(false),
                Forms\Components\KeyValue::make('feedback')
                    ->columnSpanFull(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('id')->sortable(),
                Tables\Columns\TextColumn::make('subject.subject_id')
                    ->label('Subject')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('garment.name')
                    ->label('Garment')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('size.name')
                    ->label('Size')
                    ->sortable(),
                Tables\Columns\IconColumn::make('completed_at')
                    ->label('Completed')
                    ->boolean()
                    ->trueIcon('heroicon-o-check-circle')
                    ->falseIcon('heroicon-o-clock')
                    ->trueColor('success')
                    ->falseColor('warning')
                    ->getStateUsing(fn ($record) => $record->completed_at !== null),
                Tables\Columns\TextColumn::make('movement_responses_count')
                    ->counts('movementResponses')
                    ->label('Responses'),
                Tables\Columns\TextColumn::make('started_at')->dateTime()->sortable(),
                Tables\Columns\TextColumn::make('completed_at')->dateTime()->sortable()->toggleable(),
            ])
            ->filters([
                Tables\Filters\Filter::make('completed')
                    ->label('Completed only')
                    ->query(fn ($query) => $query->whereNotNull('completed_at')),
                Tables\Filters\Filter::make('in_progress')
                    ->label('In progress only')
                    ->query(fn ($query) => $query->whereNull('completed_at')),
                Tables\Filters\SelectFilter::make('garment_id')
                    ->label('Garment')
                    ->relationship('garment', 'name'),
            ])
            ->defaultSort('started_at', 'desc')
            ->actions([
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            RelationManagers\MovementResponsesRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListAssessmentSessions::route('/'),
            'create' => Pages\CreateAssessmentSession::route('/create'),
            'edit' => Pages\EditAssessmentSession::route('/{record}/edit'),
        ];
    }
}
