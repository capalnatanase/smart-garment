<?php

namespace App\Filament\Resources\BodyZoneResource\Pages;

use App\Filament\Resources\BodyZoneResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListBodyZones extends ListRecords
{
    protected static string $resource = BodyZoneResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
