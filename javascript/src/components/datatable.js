import React, { Component } from "react";
import { renderToString } from 'react-dom/server';
import "jquery/dist/jquery.min.js";
import "datatables.net-dt/js/dataTables.dataTables";
import "datatables.net-dt/css/jquery.dataTables.min.css";
import "datatables.net-buttons-dt/css/buttons.dataTables.min.css"
import "datatables.net-buttons/js/dataTables.buttons.js";
import "datatables.net-buttons/js/buttons.colVis.js";
import "datatables.net-buttons/js/buttons.flash.js";
import "datatables.net-buttons/js/buttons.html5.js";
import "datatables.net-buttons/js/buttons.print.js";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import $ from "jquery";

pdfMake.vfs = pdfFonts.pdfMake.vfs;


var table;
const title = '';

class Datatable extends Component {

  componentDidUpdate(prevProps, prevState) {
    var dataTableId = this.props.dataTableId
    if (prevProps.items !== this.props.items) {
      this.setState({
        items: this.props.items,
        dataTableId: this.props.dataTableId
      })
      if (!$.fn.DataTable.isDataTable("#myTable")) {
        setTimeout(function () {
          table = $("#" + dataTableId).DataTable({
            responsive: true,
            pagingType: "full_numbers",
            pageLength: 10,
            //processing: true,
            dom: "Bfrtip",
            // select: {
            //     style: "single",
            // },

            buttons: [
              {
                extend: 'collection',
                text: 'Export',
                buttons: [
                  {
                    extend: 'copy',
                    exportOptions: {
                      stripHtml: false,
                      format: {
                        body: function (data, row, column, node) {
                          if (column === 3)
                            return data.replace(/<li>/g, "").replace(/<\/li>/g, ",").replace(/<ul>/g, "").replace(/<\/ul>/g, "")
                          else
                            return data.replace(/(<([^>]+)>)/ig, "");
                        }
                      }
                    }
                  },
                  {
                    extend: 'excel',
                    title: title,
                    exportOptions: {
                      stripHtml: false,
                      format: {
                        body: function (data, row, column, node) {
                          if (column === 3)
                            return data.replace("<li>", "").replace(/<li>/g, ", ").replace(/<\/li>/g, "").replace(/<ul>/g, "").replace(/<\/ul>/g, "")
                          else
                            return data.replace(/(<([^>]+)>)/ig, "");
                        }
                      }
                    }
                  },
                  {
                    extend: 'csv',
                    title: title,
                    exportOptions: {
                      stripHtml: false,
                      format: {
                        body: function (data, row, column, node) {
                          if (column === 3)
                            return data.replace("<li>", "").replace(/<li>/g, ", ").replace(/<\/li>/g, "").replace(/<ul>/g, "").replace(/<\/ul>/g, "")
                          else
                            return data.replace(/(<([^>]+)>)/ig, "");
                        }
                      }
                    }
                  },
                  {
                    extend: 'pdfHtml5',
                    title: title,
                    exportOptions: {
                      stripHtml: false,
                      format: {
                        body: function (data, row, column, node) {
                          if (column === 3)
                            return data.replace(/<li>/g, "• ").replace(/<\/li>/g, "\n").replace(/<ul>/g, "").replace(/<\/ul>/g, "")
                          else
                            return data.replace(/(<([^>]+)>)/ig, "");
                        }
                      }
                    }
                  },
                  {
                    extend: 'print',
                    title: title
                  }
                ]
              }
            ],
            "autoWidth": false,
            fnRowCallback: function (
              nRow,
              aData,
              iDisplayIndex,
              iDisplayIndexFull
            ) {

              var index = iDisplayIndexFull + 1;
              $("td", nRow).each(function () {     
                var text = $(this).html()
                $(this).html(text.replaceAll('&lt;', '<').replaceAll('&gt;', '>'));
              });
              return nRow;
            },

            // lengthMenu: [
            //     [10, 20, 30, 50, -1],
            //     [10, 20, 30, 50, "All"],
            // ],
            // columnDefs: [
            //     {
            //         targets: 0,
            //         render: function (data, type, row, meta) {
            //             return type === "export" ? meta.row + 1 : data;
            //         },
            //     },
            // ],
          });
        }, 1000)
      }
    }
  }

  componentDidMount() {

  }

  listNames = (names, key) => {
    if (this.props.columnSep && key == this.props.columnSep && typeof names === 'string') {
      return renderToString(
        <ul>
          {
            names.split("||").map((name, keyIndex) => (
              <li key={name.toString() + keyIndex.toString()}>{name}</li>
            ))
          }

        </ul>
      )
    } else return (
      names
    )

  }

  showTable = (items) => {
    if (!items || items.length == 0) return (<tr>
      <td></td>
      <td>No data available in the table</td>
    </tr>)
    return items.map((item, index) => {
      return (
        <tr key={index.toString()}
            className="test">
          <td className="text-xs font-weight-bold">{index + 1}</td>
          {
            Object.keys(item).map((key, keyIndex) =>
              (
                <td key={key.toString()+keyIndex.toString()}
                    className="text-xs font-weight-bold" dangerouslySetInnerHTML={{ __html: this.listNames(item[key], key) }}>
                </td>
              )
            )
          }
        </tr>
      );
    });
  };

  showColumns = (items) => {
    try {
      return (
        <tr>
          <th className="text-uppercase text-secondary text-sm font-weight-bolder opacity-7 ps-2">S/N</th>
          {
            items && items.length > 0 ?
              Object.keys(items[0]).map((key, keyIndex) => (
                <th key={key.toString() + keyIndex.toString()}
                    className="text-uppercase text-secondary text-sm font-weight-bolder opacity-7 ps-2">{key}</th>
              ))
              :
              <th className="text-uppercase text-secondary text-sm font-weight-bolder opacity-7 ps-2">Data</th>
          }
        </tr>
      )
    } catch (e) {
      //alert(e.message);
    }
  }

  render() {

    return (
      <div className="container py-4">
        <div className="table-responsive p-0 pb-2">
          <table id={this.props.dataTableId} className="table align-items-center justify-content-center mb-0">
            <thead>
            {this.showColumns(this.props.items)}
            </thead>

            <tbody>
            {this.showTable(this.props.items)}
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}

export default Datatable;