import io

import xlsxwriter
from xlsxwriter import Workbook
from xlsxwriter.worksheet import Worksheet

from service_calendar.app.schemas.event import EventRead
from web.app.schemas.representation import ReadStatisticsDistrict, ReadAreaCard, MonthStatistic, DistrictStatistic, \
    ReadRepresentation, ReadRegionsCard, LeaderBase


def write_xls(statistics: ReadStatisticsDistrict):
    workbook = xlsxwriter.Workbook('file.xlsx')
    worksheet = workbook.add_worksheet()
    write_chart(worksheet, workbook, statistics)
    workbook.close()

def stream_xls(statistics: ReadStatisticsDistrict):
    output = io.BytesIO()
    workbook = xlsxwriter.Workbook(output, {'in_memory': True})
    worksheet = workbook.add_worksheet()
    write_chart(worksheet, workbook, statistics)
    workbook.close()
    output.seek(0)
    return output


def write_chart(worksheet: Worksheet, workbook: Workbook, statistics: ReadStatisticsDistrict):
    bold = workbook.add_format({'bold': 1})

    months_date = [month.date.strftime("%d.%m.%Y") for month in statistics.months]
    months_count = [month.count_participants for month in statistics.months]

    headings = ["Дата мероприятия", "Кол-во участников"]

    data = [
        months_date,
        months_count,
    ]

    worksheet.write_row("A1", headings, bold)
    worksheet.write_column("A2", data[0])
    worksheet.write_column("B2", data[1])
    chart = build_chart(workbook)
    chart2 = build_statistics(worksheet, workbook, statistics.statistics)
    # Insert the chart into the worksheet (with an offset).
    worksheet.insert_chart("A15", chart, {"x_offset": 25, "y_offset": 10})


def build_statistics(worksheet: Worksheet, workbook: Workbook, statistics: DistrictStatistic):
    bold = workbook.add_format({"bold": 1})
    # Add the worksheet data that the charts will refer to.
    headings = ["Категория", "Значения"]
    data = [
        ["Завершённые", "Текущие", "Будущие"],
        [statistics.completed_events, statistics.current_events, statistics.upcoming_events],
    ]

    worksheet.write_row("G1", headings, bold)
    worksheet.write_column("G2", data[0])
    worksheet.write_column("H2", data[1])

    #######################################################################
    #
    # Create a new chart object.
    #
    chart1 = workbook.add_chart({"type": "pie"})

    # Configure the series. Note the use of the list syntax to define ranges:
    chart1.add_series(
        {
            "name": "Pie sales data",
            "categories": "=Sheet1!$G$2:$G$5",
            "values": "=Sheet1!$H$2:$H$5",
        }
    )

    # Add a title.
    chart1.set_title({"name": "Количество соревнований"})

    # Set an Excel chart style. Colors with white outline and shadow.
    chart1.set_style(10)

    # Insert the chart into the worksheet (with an offset).
    worksheet.insert_chart("H12", chart1, {"x_offset": 25, "y_offset": 10})


def build_chart(workbook):
    chart = workbook.add_chart({"type": "column"})

    # The following is used to get a mix of default and custom labels. The 'None'
    # items will get the default value. We also set a font for the custom items
    # as an extra example.
    custom_labels = [
        {"value": "=Sheet1!$C$2", "font": {"color": "red"}},
        None,
        {"value": "=Sheet1!$C$4", "font": {"color": "red"}},
        {"value": "=Sheet1!$C$5", "font": {"color": "red"}},
    ]

    # Configure the data series and add the data labels.
    chart.add_series(
        {
            "categories": "=Sheet1!$A$2:$A$14",
            "values": "=Sheet1!$B$2:$B$14",
            "data_labels": {"value": True, "custom": custom_labels},
        }
    )

    # Add a chart title.
    chart.set_title({"name": "Аналитика по округу"})

    # Turn off the chart legend.
    chart.set_legend({"none": True})
    return chart
