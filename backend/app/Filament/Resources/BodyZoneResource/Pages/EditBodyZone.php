<?php

namespace App\Filament\Resources\BodyZoneResource\Pages;

use App\Filament\Resources\BodyZoneResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditBodyZone extends EditRecord
{
    protected static string $resource = BodyZoneResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
