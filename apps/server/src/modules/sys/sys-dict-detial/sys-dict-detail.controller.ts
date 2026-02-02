import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { SysDictDetailService } from './sys-dict-detail.service';
import {
  CreateSysDictDetailDto,
  GetSysDictDetailListDto,
  RemoveSysDictDetailDto,
  UpdateSysDictDetailDto,
} from './dto/req-sys-dict-detail.dto';
import { Permission } from '@/common/decorators/permission.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateDtoPipe } from '@/common/pipes/createDto.pipe';
import { UpdateDtoPipe } from '@/common/pipes/updateDto.pipe';

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
