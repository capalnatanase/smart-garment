<?php

namespace App\Filament\Resources\MovementResponseResource\Pages;

use App\Filament\Resources\MovementResponseResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListMovementResponses extends ListRecords
{
    protected static string $resource = MovementResponseResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
