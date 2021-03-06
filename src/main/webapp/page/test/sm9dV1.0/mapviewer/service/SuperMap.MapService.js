﻿define(function (require, exports, module) {
    BaseObject.MapService = BaseHelper.Class.create();
    BaseObject.MapService.prototype = BaseHelper.Class.inherit(BaseObject.Component, {

        initialize: function (globalMap, configData) {
            this.ID = this.getGUID();
            if (globalMap) {
                configData == null ? {} : configData;
                this.init(globalMap, configData);
            }
        },

        init: function (globalMap, configData) {
            this.globalMap = globalMap;
            this.configData = configData;
        },


        //辅助类方法
        getLayerByCode: function (id) {
            var thisCallBack = this;

            var remoteService =require("mapviewer-remote-service");
            var remoteParameter = require("mapviewer-remote-parameter"); //
            //获取所有图层
            remoteParameter.RESOURCE_NAME = "T_PLATFORM_GIS_CONFIG";
            remoteParameter.REMOTE_METHOD = "getLayersByCode";
            remoteParameter.RESULT_TYPE = "JSON";
            remoteParameter.FILTER_PARAMENTER = '"CODE":"' + id + '"';
            remoteService.execute(remoteParameter, function (result) {
                if (result.element != null) {
                    if (result.element != null) {
                        if (result.element.length > 1) {
                            var root = {
                                CODE: '-1',
                                ID: '-1',
                                PID: '-1',
                                NAME: "图层目录",
                                ISLEAF: 0,
                                CHILDREN: []
                            };
                            for (var index = 0; index < result.element.length; index++) {
                                var item = result.element[index];
                                item.PID = '-1';
                                root.CHILDREN.push(result.element[index])
                            }
                            var data = [root];
                            createConfigLayer(data);
                        }
                        else
                            createConfigLayer(result.element);
                        thisCallBack.dispathEvent("processCompleted", result.element);
                    }
                } else {
                    alert("查询为空"); thisCallBack.dispathEvent("processFailed", queryEventArgs);
                }
            });
 
            function createConfigLayer(data) {

                for (var index = 0; index < data.length; index++) {
                    var item = data[index];
                    item.DATASOURCE = BaseObject.baseDatasource;
                    if (item.ISLEAF) {
                        var urlStr = [];

                        if (item.URL.split("|").length == 1) {
                            urlStr[0] = item.URL.split("|")[0];
                            urlStr[1] = item.URL.split("|")[0];
                        }
                        else {
                            urlStr = item.URL.split("|")[1].split("@");
                        }
                        if (thisCallBack.globalMap.hashMapLayers) {
                            thisCallBack.globalMap.hashMapLayers[item.CODE] = item;
                        }

                    }
                    if (item.CHILDREN != null && item.CHILDREN.length > 0) {

                        createConfigLayer(item.CHILDREN);
                    }
                }
            }
        },



        //辅助类方法
        getLayersByCatalogCode: function (id,isGroup) {
            var thisCallBack = this;

            var remoteService = require("mapviewer-remote-service");
            var remoteParameter = require("mapviewer-remote-parameter"); //
            //获取所有图层
            remoteParameter.RESOURCE_NAME = "T_PLATFORM_GIS_CONFIG";
            remoteParameter.REMOTE_METHOD = "getLayersByCatalogCode";
            remoteParameter.RESULT_TYPE = "JSON";
            remoteParameter.FILTER_PARAMENTER = '"CODE":"' + id + '",ISGROUP:"' + isGroup + '"';
            remoteService.execute(remoteParameter, function (result) {
                if (result.element != null) {
                    thisCallBack.dispathEvent("processCompleted", result.element);
                } else {
                    //alert("查询为空"); thisCallBack.dispathEvent("processFailed", queryEventArgs);
                }
            });
        },
        getStatsIdxCategory: function (id) {
            var thisCallBack = this;

            var remoteService = require("mapviewer-remote-service");
            var remoteParameter = require("mapviewer-remote-parameter"); //
            //获取所有图层
            remoteParameter.RESOURCE_NAME = "T_PLATFORM_STATS_INDEX";
            remoteParameter.REMOTE_METHOD = "searchStatsIdxCategory";
            remoteParameter.RESULT_TYPE = "JSON";
            remoteParameter.FILTER_PARAMENTER = '"code":"' + id + '"';
            remoteService.execute(remoteParameter, function (result) {
                if (result.element != null) {
                    thisCallBack.dispathEvent("processCompleted", result.element);
                } else {
                    //alert("查询为空"); thisCallBack.dispathEvent("processFailed", queryEventArgs);
                }
            });
        },

        getStatsIdxItem: function (id) {
            var thisCallBack = this;

            var remoteService = require("mapviewer-remote-service");
            var remoteParameter = require("mapviewer-remote-parameter"); //
            //获取所有图层
            remoteParameter.RESOURCE_NAME = "T_PLATFORM_STATS_INDEX";
            remoteParameter.REMOTE_METHOD = "searchStatsIdxItem";
            remoteParameter.RESULT_TYPE = "JSON";
            remoteParameter.FILTER_PARAMENTER = '"categoryId":"' + id + '"';
            remoteService.execute(remoteParameter, function (result) {
                if (result!= null) 
                    thisCallBack.dispathEvent("processCompleted", result.element);
            });
        },
   
        getStatsIdxResult: function (categoryId, dicstrictCode, qhlevel, statsDate) {
            var thisCallBack = this;

            var remoteService = require("mapviewer-remote-service");
            var remoteParameter = require("mapviewer-remote-parameter"); //
            //获取所有图层
            remoteParameter.RESOURCE_NAME = "T_PLATFORM_STATS_INDEX";
            remoteParameter.REMOTE_METHOD = "searchStatsIdxResult";
            remoteParameter.RESULT_TYPE = "JSON";
            remoteParameter.FILTER_PARAMENTER = '"categoryId":"' + categoryId + '","qhlevel":"' + qhlevel + '","dicstrictCode":"' + dicstrictCode + '","statsDate":"' + statsDate + '"';
            remoteService.execute(remoteParameter, function (result) {
                if (result != null)
                    thisCallBack.dispathEvent("processCompleted", result.element);
            });
        },

        //辅助类方法
        getBanbh: function (callback) {
            var thisCallBack = this;

            var remoteService = require("mapviewer-remote-service");
            var remoteParameter = require("mapviewer-remote-parameter"); //
            //获取所有图层
            remoteParameter.RESOURCE_NAME = "T_PLATFORM_GIS_CONFIG";
            remoteParameter.REMOTE_METHOD = "getBanbh";
            remoteParameter.RESULT_TYPE = "JSON";
            remoteParameter.FILTER_PARAMENTER = '';
            remoteService.execute(remoteParameter, function (result) {
                if (result.element != null) {
                    if (callback) callback(result.element);
                    thisCallBack.dispathEvent("processCompleted", result.element);
                } else {
                    alert("查询为空"); thisCallBack.dispathEvent("processFailed", queryEventArgs);
                }
            });
        },

        //辅助类方法
        getServiceInfoById: function (id) {
            var thisCallBack = this;
            var remoteService = require("mapviewer-remote-service");
            var remoteParameter = require("mapviewer-remote-parameter"); //
            //获取所有图层
            remoteParameter.RESOURCE_NAME = "T_PLATFORM_GIS_CONFIG";
            remoteParameter.REMOTE_METHOD = "getServiceInfoById";
            remoteParameter.RESULT_TYPE = "JSON";
            remoteParameter.FILTER_PARAMENTER = '"SERVICE_ID":"' + id + '"';
            remoteService.execute(remoteParameter, function (result) {
                if (result.element != null) {
                    thisCallBack.dispathEvent("processCompleted", result.element);
                } else {
                    alert("查询为空"); thisCallBack.dispathEvent("processFailed", queryEventArgs);
                }
            });
        },
        

        //辅助类方法
        getLayerByMapId: function (id) {
            var thisCallBack = this;

            var remoteService = require("mapviewer-remote-service");
            var remoteParameter = require("mapviewer-remote-parameter"); //
            //获取所有图层
            remoteParameter.RESOURCE_NAME = "T_PLATFORM_GIS_CONFIG";
            remoteParameter.REMOTE_METHOD = "getLayersByMapId";
            remoteParameter.RESULT_TYPE = "JSON";
            remoteParameter.FILTER_PARAMENTER = '"MAP_ID":"' + id + '"';
            remoteService.execute(remoteParameter, function (result) {
                if (result.element != null) {
                    if (result.element != null) {
                        if (result.element.length > 1) {
                            var root = {
                                CODE: '-1',
                                ID: '-1',
                                PID: '-1',
                                NAME: "图层目录",
                                ISLEAF: 0,
                                CHILDREN: []
                            };
                            for (var index = 0; index < result.element.length; index++) {
                                var item = result.element[index];
                                item.PID = '-1';
                                root.CHILDREN.push(result.element[index])
                            }
                            var data = [root];
                            createConfigLayer(data);
                        }
                        else
                            createConfigLayer(result.element);
                        thisCallBack.dispathEvent("processCompleted", result.element);
                    }
                } else {
                    alert("查询为空"); thisCallBack.dispathEvent("processFailed", queryEventArgs);
                }
            });
 
            function createConfigLayer(data) {

                for (var index = 0; index < data.length; index++) {
                    var item = data[index];
                    item.DATASOURCE = BaseObject.baseDatasource;
                    if (item.ISLEAF) {
                        var urlStr =[];

                        if (item.URL.split("|").length == 1) {
                            urlStr[0] = item.URL.split("|")[0];
                            urlStr[1] = item.URL.split("|")[0];
                        }
                        else {
                            urlStr = item.URL.split("|")[1].split("@");
                        }
                        if (thisCallBack.globalMap.hashMapLayers) {
                            thisCallBack.globalMap.hashMapLayers[item.CODE] = item;
                        }

                    }
                    if (item.CHILDREN != null && item.CHILDREN.length > 0) {

                        createConfigLayer(item.CHILDREN);
                    }
                }
            }
        },

        //辅助类方法
        getMetadataByDatasetName: function (name,callback) {
            var thisCallBack = this;
            var remoteService = require("mapviewer-remote-service");
            var remoteParameter = require("mapviewer-remote-parameter"); //
            //获取所有图层
            remoteParameter.RESOURCE_NAME = "T_PLATFORM_GIS_CONFIG";
            remoteParameter.REMOTE_METHOD = "getMetadataByDatasetName";
            remoteParameter.RESULT_TYPE = "JSON";
            remoteParameter.FILTER_PARAMENTER = '"NAME":"' + name + '"';
            remoteService.execute(remoteParameter, function (result) {
                if (result.element != null) {
                    thisCallBack.dispathEvent("processCompleted", result.element);
                    if (callback) callback(result.element);
                } else {
                    alert("查询为空"); thisCallBack.dispathEvent("processFailed", queryEventArgs);
                }
            });
        },
		searchDatasetMetaData: function (code, feature,callback) {

            var remoteService = require("mapviewer-remote-service");
            var remoteParameter = require("mapviewer-remote-parameter"); //
            //获取所有图层
            remoteParameter.RESOURCE_NAME = "GIS_META_YUANSJX";
            remoteParameter.RESULT_TYPE = "JSON";
            remoteParameter.FILTER_PARAMENTER = "{KEY_WORDS:'"+code+"'}";
            remoteParameter.REMOTE_METHOD = "search";
            remoteService.execute(remoteParameter, function (result) {
                callback(result,feature);
            });
        },
        //辅助类方法
        getAllLayers: function (id) {
            var thisCallBack = this;
            thisCallBack.globalMap.hashMapAllLayers = [];
            var remoteService = require("mapviewer-remote-service");
            var remoteParameter = require("mapviewer-remote-parameter");
            //获取所有图层
            remoteParameter.RESOURCE_NAME = "T_PLATFORM_GIS_CONFIG";
            remoteParameter.REMOTE_METHOD = "getAllLayers";
            remoteParameter.RESULT_TYPE = "JSON";
            remoteParameter.FILTER_PARAMENTER = '"1=1"';
            remoteService.execute(remoteParameter, function (result) {
                if (result.element != null) {
                    $.each(result.element, function (index, item) 
                    {
                        var urlStr = [];

                        if(item.URL.split("|").length==1)
                        {
                            urlStr[0] = item.URL;
                            urlStr[1] = item.URL;
                        }
                        item.DATASOURCE = BaseObject.baseDatasource;
                        thisCallBack.globalMap.hashMapAllLayers[item.CODE] = item;
                    });
                }
            });
        },

        //辅助类方法
        searchTreeByDistrict: function (id,callback) {
         
            var remoteService = require("mapviewer-remote-service");
            var remoteParameter = require("mapviewer-remote-parameter");
            //获取所有图层
            remoteParameter.RESOURCE_NAME = "T_PLATFORM_GIS_DISTRICT";
            remoteParameter.RESULT_TYPE = "JSON";
            remoteParameter.FILTER_PARAMENTER = '"1=1"';
            remoteParameter.REMOTE_METHOD = "searchByTree";
            remoteParameter.IS_ASYNC = 1;

            remoteService.execute(remoteParameter, function (result) {
                callback(result);
            });
        },

        //辅助类方法
        searchTreeByDistrictPID: function (id, callback) {

            var remoteService = require("mapviewer-remote-service");
            var remoteParameter = require("mapviewer-remote-parameter"); //
            //获取所有图层
            remoteParameter.RESOURCE_NAME = "T_PLATFORM_GIS_DISTRICT";
            remoteParameter.RESULT_TYPE = "JSON";
            remoteParameter.FILTER_PARAMENTER = id;
            remoteParameter.REMOTE_METHOD = "searchTreeByPID";
            remoteParameter.IS_ASYNC = 1;

            remoteService.execute(remoteParameter, function (result) {
                callback(result);
            });
        },
		
        analyticMapInfo: function (data, callback) {

            var remoteService = require("mapviewer-remote-service");
            var remoteParameter = require("mapviewer-remote-parameter"); //
            //获取所有图层
            remoteParameter.RESOURCE_NAME = "T_PLATFORM_COMPLEXMAP";
            remoteParameter.REMOTE_METHOD = "analyticMapInfo";
            remoteParameter.RESULT_TYPE = "JSON";
            //instance.analyticMapInfo(data.mapUrl+"?token="+BaseObject.TokenKey, function (e) {
            remoteParameter.FILTER_PARAMENTER = '{"mapUrl":"' + data + '"}';
            remoteService.execute(remoteParameter, function (result) {
                if (result.element != null) {
                    if (result.element != null) {
                        callback(result.element);
                    }
                } else {
                    callback("查询失败！");
                }
            });

        },

        getUniqueValue: function (data, callback) {

            var remoteService = require("mapviewer-remote-service");
            var remoteParameter = require("mapviewer-remote-parameter"); //
            //获取所有图层
            remoteParameter.RESOURCE_NAME = "T_GIS_META_YUANSJX";
            remoteParameter.REMOTE_METHOD = "getUniqueValue";
            remoteParameter.RESULT_TYPE = "JSON";
            remoteParameter.START = 0;
            remoteParameter.LIMIT = 0;
            remoteParameter.FILTER_PARAMENTER = "1=1";
            remoteService.execute(remoteParameter, function (result) {
                if (result.element != null) {
                    if (result.element != null) {
                        callback(result);
                    }
                } else {
                    callback(result);
                }
            });

        },

        searchByArea: function (conditions, level) {
            var thisCallBack = this;
            var getFeatureParam, getFeatureBySQLService, getFeatureBySQLParams;
            var datasetName = ["xzqh:市界"];
            if (level == "4") {
                datasetName = ["xzqh:县界"];
            }
            getFeatureParam = new SuperMap.REST.FilterParameter({
                attributeFilter: " 1= 1 " + (conditions == "" ? "" : " and " + conditions)
            });
            getFeatureBySQLParams = new SuperMap.REST.GetFeaturesBySQLParameters({
                queryParameter: getFeatureParam,
                datasetNames: datasetName
            });
            getFeatureBySQLService = new SuperMap.REST.GetFeaturesBySQLService(
				BaseObject.mapDataEditUrl + "/data-xzqh/rest/data", {
				    eventListeners: {
				        "processCompleted": function (queryEventArgs) {
				            thisCallBack.processCompleted(queryEventArgs)
				        },
				        "processFailed": function (queryEventArgs) {
				            thisCallBack.processFailed(queryEventArgs)
				        }
				    }
				});
            getFeatureBySQLService.processAsync(getFeatureBySQLParams);
        },
        processCompleted: function (queryEventArgs) {
            //alert("sql查询成功");
            this.dispathEvent("processCompleted", queryEventArgs);
        },
        processFailed: function (e) {
            //alert("sql查询失败-->"+e.error.errorMsg);
            this.dispathEvent("processFailed", queryEventArgs);
        },

        clear: function () {

            if (this.isAdd) {

                this.drawVector.removeAllFeatures();
                this.isAdd = false;
            }
        },


        drop: function () {

            if (this.globalMap.editTargetFeature) {
                var thisCallBack = this;
                var datasetName = thisCallBack.globalMap.editTargetLayer.datasetName;
                var layerCode = thisCallBack.globalMap.editTargetLayer.layerCode;
                var account = this.globalMap.params.account;
                art.dialog.confirm("是否确认删除", function () {
                    art.dialog({ time: 100, content: '后台运行中,请稍后......' });

                    var resourceName = thisCallBack.globalMap.editTargetFeature.attributes[thisCallBack.globalMap.layerFieldHashMap[thisCallBack.globalMap.editTargetLayer.layerCode]];
                    var attrs = thisCallBack.globalMap.editTargetFeature.attributes;
                    var geometry = thisCallBack.globalMap.editTargetFeature.geometry;
					var metaId = thisCallBack.globalMap.editTargetFeature.attributes.META_ID;
                    var editFeatureParameter, features, attributes, feature = thisCallBack.globalMap.editTargetFeature;
                    var attrNames = [];
                    var attrValues = [];
                    for (var attr in attrs) {
                        attrNames.push(attr);
                        attrValues.push(attrs[attr]);
                    }
                    features = {
                        fieldNames: attrNames,
                        fieldValues: attrValues,
                        geometry: geometry
                    };
                    features.geometry.id = feature.fid;
                    editFeatureParameter = new SuperMap.REST.EditFeaturesParameters({
                        features: [features]
                    });
                    var jsonParameters = SuperMap.REST.EditFeaturesParameters.toJsonParameters(editFeatureParameter);
                    var json = jsonParameters.substring(1, jsonParameters.length - 1);
                    var url = BaseObject.mapDataEditUrl + '/saveEdit/saveEditInterface';
                    $.post(url,
		    		{
		    		    datasetName: thisCallBack.globalMap.editTargetLayer.layerName,
		    		    datasetCode: thisCallBack.globalMap.editTargetLayer.layerCode,
		    		    jilmc: resourceName,
		    		    userName: account,
						yaosid:metaId,
		    		    featureJson: json,
		    		    operType: '删除',
		    		    submit: '提交'
		    		}, function (result) {
		    		    var jsonObject = JSON.parse(result);
		    		    $(".aui_state_focus").remove();
		    		    if (jsonObject.success) {
		    		        art.dialog.tips("资源删除成功！");
		    		        thisCallBack.globalMap.dispathEvent("deleteFeatureCompleted", jsonObject);
		    		    }
		    		    else {
		    		        art.dialog.tips(jsonObject.message);
		    		    }
		    		}
		    		);
                });
            }
        },
        revoke: function (id) {
            //alert(id+"<>"+account);
            var thisCallBack = this;
            var account = this.globalMap.params.account;
            art.dialog.confirm("是否确认撤销", function () {
                art.dialog({ time: 100, content: '后台运行中,请稍后......' });
                var url = BaseObject.mapDataEditUrl + "/revertBianj/revertBianjInterface";
                url += "?bjid=" + id + "&userName=" + account + "&submit=提交";
                $.ajax({
                    url: encodeURI(encodeURI(url)),
                    type: "GET",
                    dataType: 'jsonp',
                    //jsonp的值自定义,如果使用jsoncallback,那么服务器端,要返回一个jsoncallback的值对应的对象. 
                    jsonp: 'jsoncallback',
                    //要传递的参数,没有传参时，也一定要写上 
                    //data: null,
                    timeout: 5000,
                    //返回Json类型 
                    contentType: "application/json",
                    //服务器段返回的对象包含name,data属性. 
                    success: function (result) {
                        //$(".aui_outer").hide();
                        $(".aui_state_focus").remove();
                        //var jsonObject = JSON.parse(result);
                        if (result.success) {
                            art.dialog.tips("资源撤销成功！");
                            thisCallBack.globalMap.dispathEvent("revokeFeatureCompleted", result);
                        }
                        else {
                            art.dialog.tips(result.message);
                        }

                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        art.dialog.tips("操作失败！");
                    }
                });
            });
        },


        save: function () {

            if (!this.globalMap.editTargetFeature) { art.dialog.tips("获取保存对象为空！"); return }
            var thisCallBack = this;
            var account = this.globalMap.params.account;
            art.dialog({ time: 100, content: '后台运行中,请稍后......' });
            var geoJsonObj = new SuperMap.Format.GeoJSON();

            var resourceName = this.globalMap.editTargetFeature.attributes[this.globalMap.layerFieldHashMap[this.globalMap.editTargetLayer.layerCode]];
            resourceName = resourceName || "-";
            var attrs = this.globalMap.editTargetFeature.attributes;
            var datasetName = this.globalMap.editTargetLayer.layerName;
            var datasetCode = this.globalMap.editTargetLayer.layerCode;
            var geometry = this.globalMap.editTargetFeature.geometry;
			var metaId = this.globalMap.editTargetFeature.attributes.META_ID;
            var editFeatureParameter, features, attributes, feature = this.globalMap.editTargetFeature;
            var attrNames = [];
            var attrValues = [];
            for (var attr in attrs) {
                attrNames.push(attr);
                attrValues.push(attrs[attr]);
            }
            features = {
                fieldNames: attrNames,
                fieldValues: attrValues,
                geometry: geometry
            };
            features.geometry.id = feature.fid;

            if (this.globalMap.editTargetFeature.status !== "new") {


                editFeatureParameter = new SuperMap.REST.EditFeaturesParameters({
                    features: [features],
                    editType: SuperMap.REST.EditType.UPDATE
                });
                var jsonParameters = SuperMap.REST.EditFeaturesParameters.toJsonParameters(editFeatureParameter);
                var json = jsonParameters.substring(1, jsonParameters.length - 1);
                var url = BaseObject.mapDataEditUrl + '/saveEdit/saveEditInterface';
				$.post(url,
		    		{
		    		    datasetName: datasetName,
		    		    datasetCode: datasetCode,
		    		    jilmc: resourceName,
		    		    userName: account,
						yaosid:metaId,
		    		    featureJson: json,
		    		    operType: '修改',
		    		    submit: '提交'
		    		}, function (result) {
		    		    //alert("修改成功！");

		    		    var jsonObject = JSON.parse(result);
		    		    $(".aui_outer").remove();
		    		    $(".aui_state_focus").remove();
		    		    if (jsonObject.success) {
		    		        art.dialog.tips("资源更新成功！");
		    		        thisCallBack.globalMap.dispathEvent("eidtFeatureCompleted", jsonObject);
		    		    }
		    		    else
		    		        art.dialog.tips(jsonObject.message);

		    		},'text');
            } else {

                resourceName = resourceName || "新增对象";
                features.geometry.id = this.getGUID();
                editFeatureParameter = new SuperMap.REST.EditFeaturesParameters({
                    features: [features],
                    editType: SuperMap.REST.EditType.ADD,
                    returnContent: false
                });
                var jsonParameters = SuperMap.REST.EditFeaturesParameters.toJsonParameters(editFeatureParameter);
                var json = jsonParameters.substring(1, jsonParameters.length - 1);
                var url = BaseObject.mapDataSaveUrl + '/saveEdit/saveEditInterface';
				var data = {
	    		    datasetName: datasetName,
	    		    datasetCode: datasetCode,
	    		    jilmc: resourceName,
	    		    userName: account,
	    		    featureJson: json,
	    		    operType: '新增',
	    		    submit: '提交'
	    		};
                $.post(url,data, function (result) {
	    		    var jsonObject = JSON.parse(result);
	    		    $(".aui_outer").remove();
	    		    $(".aui_state_focus").remove();
	    		    if (jsonObject.success) {
	    		        art.dialog.tips("资源保存成功！");
	    		        thisCallBack.globalMap.dispathEvent("addFeatureCompleted", jsonObject);
	    		    }
	    		    else
	    		        art.dialog.tips(result.message);
	    		},'text');
            }
        },


        CLASS_NAME: "BaseObject.MapService"
    });
    module.exports = BaseObject.MapService;
});