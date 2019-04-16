/* eslint-disable no-trailing-spaces */
'use strict';

const BaseController = require('./base.js');

class ManagerController extends BaseController {
  async index() {
    const adminList = await this.ctx.model.Admin.aggregate([{
      $lookup: {
        from: 'role', // 来源表
        localField: 'role_id',
        foreignField: '_id',
        as: 'role',
      },
    }]);
    console.log(JSON.stringify(adminList));
    await this.ctx.render('/admin/manager/index', {
      adminList,
    });
  }

  async add() {
    const roleList = await this.ctx.model.Role.find({});
    await this.ctx.render('/admin/manager/add', {
      roleList,
    });
  }

  async doAdd() {
    const adminInfo = this.ctx.request.body;
    const hasAdmin = await this.ctx.model.Admin.find({ username: adminInfo.username });
    if (hasAdmin.length > 0) {
      await this.error('/admin/manager/add', '管理员重名');
    } else {
      adminInfo.password = await this.ctx.service.tools.md5(adminInfo.password);
      const admin = new this.ctx.model.Admin(adminInfo);
      await admin.save();
      await this.success('/admin/manager', '增加管理员成功');
    }
    
  }

  async edit() {
    await this.ctx.render('/admin/manager/edit');
  }
}

module.exports = ManagerController;
