import xlsxwriter


def write_to_xls():
    workbook = xlsxwriter.Workbook()
    worksheet = workbook.add_worksheet()
    bold = workbook.add_format({'bold': 1})
    headings = ["Number", "Data", "Text"]

    data = [
        [2, 3, 4, 5, 6, 7],
        [20, 10, 20, 30, 40, 30],
        ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    ]

    worksheet.write_row("A1", headings, bold)
    worksheet.write_column("A2", data[0])
    worksheet.write_column("B2", data[1])
    worksheet.write_column("C2", data[2])
    chart = build_chart(workbook)
    # Insert the chart into the worksheet (with an offset).
    worksheet.insert_chart("D98", chart, {"x_offset": 25, "y_offset": 10})


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
