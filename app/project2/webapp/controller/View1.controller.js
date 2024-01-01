sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/Dialog",
    "sap/m/Button",
    "sap/m/Input",
    "sap/m/VBox",
    "sap/m/MessageBox"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,MessageToast,Dialog, Button, Input, VBox, MessageBox) {
        "use strict";

        return Controller.extend("project2.controller.View1", {
            onInit: async function () {
                let wholedata = await this.getDatafromTable();
                
                // Setting the data to the local model 
                this.localModel = new sap.ui.model.json.JSONModel();
                this.getView().setModel(this.localModel, "localModel");
                this.localModel.setData({
                    items: wholedata
                });
                console.log("---------",this.localModel);
                // this.localModel = wholedata;
            },


            getDatafromTable: async function () {
                const that = this;
                return new Promise( (resolve, reject) => {
                    let sUrl = that.getOwnerComponent().getModel().getServiceUrl() + "excelFile"
                    $.ajax({
                        url: sUrl,
                        method: "GET",
                        contentType: "application/json",
                        success: function (data, textStatus, jqXHR) {
                            console.log("Retrieve data successful");
                            console.log(data.value);
                            resolve(data.value);
                        // Handle success response from the server
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                        MessageToast.show("Retrieve data failed");
                        reject(errorThrown)
                        // Handle error response from the server
                        }
                    })
                })

            },

            handleFileUploadPressed:  function (oEvent) {

                let that = this;
                let fileDet = oEvent.getParameters("file").files[0];
                let filename = oEvent.getParameters("file").files[0].name;
                let fileType =  oEvent.getParameters("file").files[0].type;
                // this._import(fileDet);

                this.readFileAsBase64(fileDet);
                
                // let fileDet = oEvent.getParameters("file").files[0];

                // // Assuming your CAP service is named "myService" and the ExcelUpload operation is available

                // let sUrl = that.getOwnerComponent().getModel().getServiceUrl() + "ExcelUpload" 

          
                // // Create a FormData object to send the file to the backend
                // let oFormData = new FormData();
                // oFormData.append("file", fileDet);
          
                // // Make an AJAX request to the backend to trigger the ExcelUpload operation
                // $.ajax({
                //   url: sUrl,
                //   type: "POST",
                //   data: oFormData,
                //   processData: false, // prevent jQuery from processing the data
                //   contentType: "multipart/form-data", // prevent jQuery from setting contentType
                //   success: function (data, textStatus, jqXHR) {
                //     MessageToast.show(data.message);
                //     // Refresh the UI or perform additional actions if needed
                //   },
                //   error: function (jqXHR, textStatus, errorThrown) {
                //     MessageToast.show("File upload failed");
                //   },
                // });                


                
            },
            
            readFileAsBase64: function (oFile) {
                var oReader = new FileReader();
                var that = this;

                oReader.onload = function (e) {
                   var sBase64Data = e.target.result.split(",")[1]; // Extract base64 data
                //    MessageToast.show("Base64 representation: " + sBase64Data);
                
                let sUrl = that.getOwnerComponent().getModel().getServiceUrl() + "files" 

                let idtemp= Math.floor(Math.random() * (1   - 1000 + 1)) + 1000;
                let payload = {"fileId":idtemp,"fileName":oFile.name,"fileType":oFile.type,"base64Data":sBase64Data};
                $.ajax({
                    url: sUrl,
                    method: "POST",
                    contentType: "application/json",
                    data: JSON.stringify(payload),
                    success: function (data, textStatus, jqXHR) {
                       MessageToast.show("Upload successful");
                       // Handle success response from the server
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                       MessageToast.show("Upload failed");
                       // Handle error response from the server
                    }
                 });
                   // Now you can send sBase64Data to your server or process it further
                };
                
                oReader.readAsDataURL(oFile);
                
             },


            //  ---------------------------------DOWNLOAD BUTTON ---------------------------------------------------
            //  handleShowButtonPressed : function (oEvent) {

            //     let sUrl = this.getOwnerComponent().getModel().getServiceUrl() + "files";

            //     $.ajax({
            //         url: sUrl,
            //         method: "GET",
            //         contentType: "application/json",
            //         success: function (data, textStatus, jqXHR) {
            //            MessageToast.show("Download successful");
            //            // ------------------Handle success response from the server--------------------------
            //            var filtarrAttach = data.value;
            //            for (let a = 0; a < filtarrAttach.length; a++) {
            //             var base64String = filtarrAttach[a].base64Data;
            //             var binaryData = atob(base64String);
            //             var uint8Array = new Uint8Array(binaryData.length);
            //             for (var i = 0; i < binaryData.length; i++) {
            //                 uint8Array[i] = binaryData.charCodeAt(i);
            //             }
            //             var blob = new Blob([uint8Array], {
            //                 type: filtarrAttach[a].MimeType
            //             }); // ---------------Change the type to match your image file type-----------------
                       
            //             var imageUrl = URL.createObjectURL(blob);
            //             var downloadLink = document.createElement("a");
            //             downloadLink.href = imageUrl;
            //             downloadLink.download = filtarrAttach[a].fileName; 
            //             downloadLink.click();
            //         }
            //         },
            //         error: function (jqXHR, textStatus, errorThrown) {
            //            MessageToast.show("Upload failed");
            //            // Handle error response from the server
            //         }
            //      });
                 
            //  },


             _import: function (file) {
                var that = this;
                let excelData = {};

                if (file && window.FileReader) {
                    var reader = new FileReader();
                    reader.onload = function (e) {

                        var data = e.target.result;

                        var workbook = XLSX.read(data, {
                            type: 'binary'
                        });

                        workbook.SheetNames.forEach(function (sheetName) {
                            // Here is your object for every sheet in workbook
                            excelData = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                        });
                        console.log("show:",excelData);
                        that.addToExcelDataTable(excelData);
                        // Setting the data to the local model 
                        // that.localModel.setData({
                        //     items: excelData
                        // });
                        // that.localModel.refresh(true);
                    };
                    // console.log("show:",excelData);
                    reader.onerror = function (error) {
                        console.log(error);
                    };
                    // MessageToast.show(excelData)
                    reader.readAsBinaryString(file);
                }           
            },
            				
            addToExcelDataTable: function (excelData) {
                let sUrl = this.getOwnerComponent().getModel().getServiceUrl() + "excelFile"
                // let payload = excelData

                excelData.forEach((item)=>{
                    
                    let payload = {
                        "exId":Number(item.id),
                        "exEmail":item.email,
                        "exFirst_name":item.first_name,
                        "exLast_name":item.last_name,
                        "exAvatar":item.avatar
                    };
                    $.ajax({
                        url: sUrl,
                        method: "POST",
                        contentType: "application/json",
                        data: JSON.stringify(payload),
                        success: function (data, textStatus, jqXHR) {
                           MessageToast.show("Upload successful");

                           var oTable = this.getView().byId("idExcelDataTable");
                           oTable.getModel("localModel").refresh(true);
                           
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                           MessageToast.show("Upload failed");
                           
                        }
                    });
                })
            },

            // POPUP Window
            handleEditButtonPressed : function (oEvent) {
                const that = this;
                var oTable = this.getView().byId("idExcelDataTable");
                var aSelectedItems = oTable.getSelectedItems();
          
                if (aSelectedItems.length === 1) {
                  // Assuming only one item can be selected at a time
                  var oSelectedItem = aSelectedItems[0];
                  var oBindingContext = oSelectedItem.getBindingContext("localModel");
                  var oRowData = oBindingContext.getProperty(); // Get all properties of the selected row
          
                  // Now you have the data of the selected row in the variable oRowData
                  console.log("Selected Row Data:", oRowData);
          
                  // You can open a dialog for editing or perform any other action with the row data here
                } else {
                  MessageBox.warning("Please select a single row for editing.");
                }
                 // Create a Dialog
                 let editId = oRowData.exId;

                var oDialog = new Dialog({
                    title: "Edit Details",
                    content: [
                        new Input({ placeholder: "Field 1" , value: oRowData.exFirst_name}),
                        new Input({ placeholder: "Field 2" , value: oRowData.exLast_name}),
                        new Input({ placeholder: "Field 3" , value: oRowData.exEmail}),
                        new Input({ placeholder: "Field 4" , value: oRowData.exAvatar})
                    ],
                    beginButton: new Button({
                        text: "Submit",
                        press: function() {
                            // Handle the submitted data
                            var updateData = {
                                exEmail : oDialog.getContent()[2].getValue(),
                                exFirst_name : oDialog.getContent()[0].getValue(),
                                exLast_name : oDialog.getContent()[1].getValue(),
                                exAvatar : oDialog.getContent()[3].getValue()
                            }
                            let sUrl = that.getOwnerComponent().getModel().getServiceUrl() + "excelFile"
                            $.ajax({
                                url: `${sUrl}(${editId})`,
                                method: "PATCH",
                                contentType: "application/json",
                                data: JSON.stringify(updateData),
                                success: function(data) {
                                    // Handle success, if needed
                                    console.log("Entity updated successfully:", data);
                                    MessageToast.show("Entity updated successfully");
                                    var aItems = that.localModel.getProperty("/items");
                                    var oUpdatedItem = aItems.find(item => item.exId === editId);
                                    if (oUpdatedItem) {
                                        oUpdatedItem.exEmail = updateData.exEmail;
                                        oUpdatedItem.exFirst_name = updateData.exFirst_name;
                                        oUpdatedItem.exLast_name = updateData.exLast_name;
                                        oUpdatedItem.exAvatar = updateData.exAvatar;
                                    }
                                    oTable.getModel("localModel").refresh(true);
                                },
                                error: function(error) {
                                    // Handle error
                                    console.error("Error updating entity:", error);
                                }
                            });
        
                            // Do something with the values (e.g., validation or further processing)

                            // Close the Dialog
                            oDialog.close();
                        }
                    }),
                    endButton: new Button({
                        text: "Cancel",
                        press: function() {
                            // Close the Dialog without processing the data
                            oDialog.close();
                        }
                    }),
                    afterClose: function() {
                    // Destroy the Dialog to avoid memory leaks
                    oDialog.destroy();
                    }
                });

                // Open the Dialog
                oDialog.open();
            },
            
            handleAddButtonPressed : function (oEvent) {
                const that = this;
                 // Create a Dialog
                var oTable = this.getView().byId("idExcelDataTable");

                var oDialog = new Dialog({
                    title: "Add Details",
                    content: [
                        new Input({ placeholder: "Id" }),
                        new Input({ placeholder: "Email" }),
                        new Input({ placeholder: "First name" }),
                        new Input({ placeholder: "Second Name" }),
                        new Input({ placeholder: "avatar"})
                    ],
                    beginButton: new Button({
                        text: "Submit",
                        press: function() {
                            // Handle the submitted data
                            var payload = {
                                exId: Number(oDialog.getContent()[0].getValue()),
                                exEmail: oDialog.getContent()[1].getValue(),
                                exFirst_name: oDialog.getContent()[2].getValue(),
                                exLast_name: oDialog.getContent()[3].getValue(),
                                exAvatar: oDialog.getContent()[4].getValue()
                            };
                            // console.log(updateData,typeof (updateData))
                            let sUrl = that.getOwnerComponent().getModel().getServiceUrl() + "excelFile"
                            $.ajax({
                                url: sUrl,
                                method: "POST",
                                contentType: "application/json",
                                data: JSON.stringify(payload),
                                // processData: false, // prevent jQuery from processing the data
                                // contentType: false,                                
                                success: function(data) {
                                    // Handle success, if needed
                                    console.log("Entity inserted successfully:"+data);
                                    MessageToast.show("Entity inserted successfully"+data.message);
                                    oTable.getModel("localModel").refresh(true);
                                },
                                error: function(error) {
                                    // Handle error
                                    MessageBox.error("Error inserting entity:"+ error);
                                }
                            });

                            // Do something with the values (e.g., validation or further processing)

                            // Close the Dialog
                            oDialog.close();
                        }
                    }),
                    endButton: new Button({
                        text: "Cancel",
                        press: function() {
                            // Close the Dialog without processing the data
                            oDialog.close();
                        }
                    }),
                    afterClose: function() {
                    // Destroy the Dialog to avoid memory leaks
                    oDialog.destroy();
                    }
                });
                // Open the Dialog
                oDialog.open();
            },

            onDeleteAllRecords: function(oEvent) {
                const that = this;
                let sUrl = that.getOwnerComponent().getModel().getServiceUrl() + "excelFile";
                // Make a DELETE request to the CAP service endpoint
                $.ajax({
                    url: sUrl,
                    method: "DELETE",
                    contentType: "application/json",
                    success: function(data, textStatus, jqXHR) {
                        MessageBox.success("All records deleted successfully");
                        // Perform any additional UI updates or refresh
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        MessageBox.error("Error deleting records");
                        console.log('errorThrown: ', errorThrown);
                        // Handle error response
                    }
                });
            }
        });
    });
