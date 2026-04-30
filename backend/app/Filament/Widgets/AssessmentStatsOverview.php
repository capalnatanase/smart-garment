<?php

namespace App\Filament\Widgets;

use App\Models\AssessmentSession;
use App\Models\Garment;
use App\Models\Subject;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class AssessmentStatsOverview extends BaseWidget
{
    protected static ?int $sort = -1;

    protected function getStats(): array
    {
        $totalSessions = AssessmentSession::count();
        $completed = AssessmentSession::whereNotNull('completed_at')->count();
        $inProgress = $totalSessions - $completed;

        return [
            Stat::make('Subjects', Subject::count())
                ->description('Registered subjects')
                ->color('primary'),
            Stat::make('Garments', Garment::count())
                ->description('Available in catalog')
                ->color('info'),
            Stat::make('Completed sessions', $completed)
                ->description($totalSessions . ' total · ' . $inProgress . ' in progress')
                ->color($completed > 0 ? 'success' : 'gray'),
        ];
    }
}
