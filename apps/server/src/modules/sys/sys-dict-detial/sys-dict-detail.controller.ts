import { Permission } from '@/common/decorators/permission.decorator';
import { CreateDtoPipe } from '@/common/pipes/createDto.pipe';
import { UpdateDtoPipe } from '@/common/pipes/updateDto.pipe';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  CreateSysDictDetailDto,
  GetSysDictDetailListDto,
  RemoveSysDictDetailDto,
  UpdateSysDictDetailDto,
} from './dto/req-sys-dict-detail.dto';
import { SysDictDetailService } from './sys-dict-detail.service';

@ApiTags('用户字典详情')
@ApiBearerAuth()
@Controller('sys/dictDetail')
export class SysDictDetailController {
  constructor(private readonly sysDictDetailService: SysDictDetailService) {}

  @Permission('sys:dictDetail:create')
  @Post()
  create(@Body(CreateDtoPipe) createSysDictDetailDto: CreateSysDictDetailDto) {
    return this.sysDictDetailService.create(createSysDictDetailDto);
  }

  @Permission('sys:dictDetail:list')
  @Get()
  findAll(@Query() query: GetSysDictDetailListDto) {
    return this.sysDictDetailService.findAll(query);
  }

  @Permission('sys:dictDetail:list')
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.sysDictDetailService.findOne(id);
  }

  @Permission('sys:dictDetail:update')
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body(UpdateDtoPipe) updateSysDictDetailDto: UpdateSysDictDetailDto,
  ) {
    return this.sysDictDetailService.update(id, updateSysDictDetailDto);
  }

  @Permission('sys:dictDetail:remove')
  @Delete()
  remove(@Body() body: RemoveSysDictDetailDto) {
    return this.sysDictDetailService.remove(body);
  }
}
