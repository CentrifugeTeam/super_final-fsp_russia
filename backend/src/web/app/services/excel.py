import xlsxwriter
from xlsxwriter import Workbook
from xlsxwriter.worksheet import Worksheet

from service_calendar.app.schemas.event import EventRead
from web.app.schemas.representation import ReadStatisticsDistrict, ReadAreaCard, MonthStatistic, DistrictStatistic, \
    ReadRepresentation, ReadRegionsCard, LeaderBase


def write_to_xls(statistics: ReadStatisticsDistrict):
    workbook = xlsxwriter.Workbook('hello.xlsx')
    worksheet = workbook.add_worksheet()
    write_chart(worksheet, workbook, statistics)
    workbook.close()


def write_chart(worksheet: Worksheet, workbook: Workbook, statistics: ReadStatisticsDistrict):
    bold = workbook.add_format({'bold': 1})

    months_date = [month.date.strftime("%d.%m.%Y") for month in statistics.months]
    months_count = [month.count_participants for month in statistics.months]

    headings = ["Дата", "Кол-во участников"]

    data = [
        months_date,
        months_count,
    ]

    worksheet.write_row("A1", headings, bold)
    worksheet.write_column("A2", data[0])
    worksheet.write_column("B2", data[1])
    chart = build_chart(workbook)
    # Insert the chart into the worksheet (with an offset).
    worksheet.insert_chart("I15", chart, {"x_offset": 25, "y_offset": 10})


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
            "categories": "=Sheet1!$A$2:$A$7",
            "values": "=Sheet1!$B$2:$B$7",
            "data_labels": {"value": True, "custom": custom_labels},
        }
    )

    # Add a chart title.
    chart.set_title({"name": "Mixed custom and default data labels"})

    # Turn off the chart legend.
    chart.set_legend({"none": True})
    return chart


if __name__ == '__main__':
    pass
    # repr = ReadRepresentation(
    #     **dict(name='something',
    #            photo_url='something',
    #            contacts='something',
    #            id=1,
    #            type='region',
    #            ))
    # leader = LeaderBase(first_name='something',last_name='something', username='something', middle_name=None)
    # ReadRegionsCard(representation=repr, leader=leader)
    # months: list[MonthStatistic]
    # statistics: DistrictStatistic
    # events: list[EventRead]
    # stat = ReadStatisticsDistrict(region=)
    # write_to_xls()
