using Dapper;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using health_path.Model;

namespace health_path.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ScheduleController : ControllerBase
{
    private readonly ILogger<ScheduleController> _logger;
    private readonly IDbConnection _connection;

    public ScheduleController(ILogger<ScheduleController> logger, IDbConnection connection)
    {
        _logger = logger;
        _connection = connection;
    }

    [HttpGet]
    public ActionResult<IEnumerable<ScheduleEvent>> Fetch()
    {
        var dbResults = ReadData();
        // group the items by key, so we can append the results appropriately
        IEnumerable<IGrouping<System.Guid,(ScheduleEvent, ScheduleEventRecurrence)>> query = dbResults.GroupBy(e=>e.Item1.Id);
        List<ScheduleEvent> results = new List<ScheduleEvent>();
        foreach(IGrouping<System.Guid,(ScheduleEvent, ScheduleEventRecurrence)> key in query){
            var items = key.ToList();
            ScheduleEvent item = items[0].Item1;
            // Reset the Recurrences so we don't get duplicates in the end result
            item.Recurrences.Clear();
            foreach ((ScheduleEvent,ScheduleEventRecurrence)subItem in key){                
                item.Recurrences.Add(subItem.Item2);
            }
            results.Add(item);

        }
        
       return Ok(results);
    }

    private IEnumerable<(ScheduleEvent, ScheduleEventRecurrence)> ReadData() {
        var sql = @"
            SELECT e.*, r.*
            FROM Event e
            JOIN EventRecurrence r ON e.Id = r.EventId
            ORDER BY e.Id, r.DayOfWeek, r.StartTime, r.EndTime
        ";
        return _connection.Query<ScheduleEvent, ScheduleEventRecurrence, (ScheduleEvent, ScheduleEventRecurrence)>(sql, (e, r) => (e, r));
    }
}
