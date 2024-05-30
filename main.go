package main

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
	"h-ui/dao"
	"h-ui/middleware"
	"h-ui/model/constant"
	"h-ui/router"
	"h-ui/service"
	"h-ui/util"
	"os"
)

func main() {
	config, err := dao.GetConfig("key = ?", constant.HUIWebPort)
	if err != nil {
		panic(fmt.Sprintf("webPort get err: %v", err))
	}
	r := gin.Default()
	router.Router(r)
	_ = r.Run(fmt.Sprintf(":%s", *config.Value))
	defer releaseResource()
}

func init() {
	initFile()
	middleware.InitLog()
	dao.InitSqliteDB()
	middleware.InitCron()
	service.InitHysteria2()
}

func releaseResource() {
	dao.CloseSqliteDB()
}

func initFile() {

	var dirs = []string{constant.LogDir, constant.SqliteDBDir, constant.BinDir, constant.ExportPathDir}
	for _, item := range dirs {
		if !util.Exists(item) {
			if err := os.Mkdir(item, os.ModePerm); err != nil {
				logrus.Errorf("%s create err: %v", item, err)
				panic(err)
			}
		}
	}
}
