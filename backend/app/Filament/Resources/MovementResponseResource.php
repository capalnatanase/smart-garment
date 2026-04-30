<?php

namespace App\Filament\Resources;

use App\Filament\Resources\MovementResponseResource\Pages;
use App\Models\MovementResponse;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class MovementResponseResource extends Resource
{
    protected static ?string $model = MovementResponse::class;

    protected static ?string $navigationIcon = 'heroicon-o-list-bullet';

    protected static ?string $navigationGroup = 'Subjects & Assessments';

    protected static ?int $navigationSort = 2;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Select::make('assessment_session_id')
                    ->label('Assessment session')
                    ->relationship('assessmentSession', 'id')
                    ->searchable()
                    ->preload()
                    ->required(),
                Forms\Components\Select::make('movement_id')
                    ->label('Movement')
                    ->relationship('movement', 'name')
                    ->searchable()
                    ->preload()
                    ->required(),
                Forms\Components\Toggle::make('no_issues')
                    ->label('No issues reported'),
                Forms\Components\Select::make('bodyZones')
                    ->label('Body zones (with discomfort)')
                    ->multiple()
                    ->relationship('bodyZones', 'name')
                    ->preload()
                    ->columnSpanFull(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('assessmentSession.id')
                    ->label('Session')
                    ->sortable(),
                Tables\Columns\TextColumn::make('assessmentSession.subject.subject_id')
                    ->label('Subject')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('movement.name')
                    ->label('Movement')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\IconColumn::make('no_issues')
                    ->label('No issues')
                    ->boolean(),
                Tables\Columns\TextColumn::make('body_zones_count')
                    ->counts('bodyZones')
                    ->label('Zones'),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(),
            ])
            ->filters([
                Tables\Filters\TernaryFilter::make('no_issues'),
                Tables\Filters\SelectFilter::make('movement_id')
                    ->label('Movement')
                    ->relationship('movement', 'name'),
            ])
            ->defaultSort('created_at', 'desc')
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
            'index' => Pages\ListMovementResponses::route('/'),
            'create' => Pages\CreateMovementResponse::route('/create'),
            'edit' => Pages\EditMovementResponse::route('/{record}/edit'),
        ];
    }
}
