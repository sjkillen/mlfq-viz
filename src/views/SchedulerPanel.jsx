/**
 * Render the Scheduler Panel
 */

export default function SchedulerPanel(scheduler) {
   return (
      <div>
         Status:
         {window.getStatus()}
      </div>
   );
}