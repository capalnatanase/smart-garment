<?php

namespace App\Filament\Resources\AssessmentSessionResource\Pages;

use App\Filament\Resources\AssessmentSessionResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditAssessmentSession extends EditRecord
{
    protected static string $resource = AssessmentSessionResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
