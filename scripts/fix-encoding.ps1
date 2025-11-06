$files = @(
  "src\components\premium\CustomThemes.jsx",
  "src\components\premium\StreakInsurance.jsx",
  "src\components\priority2\AllComponents.jsx",
  "src\components\priority2\MedicationTracker.jsx",
  "src\components\priority4\PeerSupport.jsx",
  "src\components\priority4\SupportRequests.jsx",
  "src\components\priority5\MoodPrediction.jsx",
  "src\components\priority6\DataExport.jsx",
  "src\components\priority7\OfflineMode.jsx",
  "src\components\therapeutic\MentalHealthAssessments.jsx",
  "src\i18n\locales\en.json",
  "src\pages\CircleFeedPage.jsx",
  "src\pages\CirclesPage.jsx",
  "src\pages\CopingSkillsPage.jsx",
  "src\pages\EmotionTrackerPage.jsx",
  "src\pages\GamificationPage.jsx",
  "src\pages\HomePage.jsx",
  "src\pages\HabitTrackerPage.jsx",
  "src\pages\ProfilePage.jsx",
  "src\pages\RemindersPage.jsx",
  "src\pages\WellnessPlanPage.jsx"
)

foreach ($file in $files) {
  if (Test-Path $file) {
    $content = Get-Content $file -Raw -Encoding UTF8
    $content = $content -replace 'â€¢', '•'
    $content = $content -replace 'â€™', "'"
    $content = $content -replace 'â€"', '–'
    $content = $content -replace 'ðŸ', '🎯'
    [System.IO.File]::WriteAllText($file, $content, [System.Text.Encoding]::UTF8)
    Write-Host "Fixed: $file"
  }
}

Write-Host "`nEncoding fix complete!"
